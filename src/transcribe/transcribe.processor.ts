import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { FileService } from 'src/file/file.service';
import { blob } from 'stream/consumers';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { commands } from 'src/queue';
import { OrchestrationService } from 'src/queue/orchestration.service';
import { CallService } from 'src/call/call.service';

const { WHISPER_URL = '' } = process.env;

@Injectable()
@Processor(commands.TRANSCRIBE_CALL)
export class TranscribeProcessor extends WorkerHost {
  constructor(
    private readonly callService: CallService,
    private readonly fileService: FileService,
    private readonly httpService: HttpService,
    private readonly orchestrationService: OrchestrationService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<{ callId: string }, { callId: string }, any>) {
    const { callId } = job.data;
    this.logger.log(`Transcribing audio for call ${callId}`);
    const { fileId } = await this.callService.getById(callId);
    const fileStream = this.fileService.readFileByObjectId(fileId);

    if (!fileStream) {
      throw new Error('File not found');
    }

    const file = await blob(fileStream);

    const formData = new FormData();
    formData.append('audio_file', file, 'test.mp3');
    formData.append('encode', 'true');
    formData.append('task', 'transcribe');
    formData.append('language', 'en');
    formData.append('word_timestamps', 'false');
    formData.append('output', 'txt');

    this.logger.log(
      `Transcribing audio for call ${fileId}, POST ${WHISPER_URL}/asr`,
    );
    // Make a POST request to the WHISPER_URL with the file stream
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${WHISPER_URL}/asr`, formData, {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        })
        .pipe(
          catchError((error: AxiosError) => {
            const errorData = error.response?.data || error;
            this.logger.error(errorData);
            throw errorData;
          }),
        ),
    );

    this.logger.log(`Audio Transcribed`);

    await this.callService.update(callId, { text: data });

    this.logger.log(`Call Updated`);

    await this.orchestrationService.emitCallTranscribedEvent({ callId });

    return { callId };
  }
}
