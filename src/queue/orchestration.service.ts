import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { commands } from '.';
import { Queue } from 'bullmq';

@Injectable()
export class OrchestrationService {
  constructor(
    private readonly logger: Logger,
    @InjectQueue(commands.TRANSCRIBE_CALL)
    private readonly transcribeQueue: Queue,
  ) {}

  async emitCallUploadedEvent({ callId }: { callId: string }) {
    this.logger.log(`Adding call to transcribe ${callId}`);
    await this.transcribeQueue.add(commands.TRANSCRIBE_CALL, { callId });
  }

  async emitCallTranscribedEvent({ callId }: { callId: string }) {
    this.logger.log(`File Transcribed, sending text to tokenize  ${callId}`);
    // await this.eventQueue.add(commands.TRANSCRIBE_AUDIO, { fileId });
  }
}
