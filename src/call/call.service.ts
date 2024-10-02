import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CallRepository } from './call.repository';
import { CreateCallDto } from './call.dto';
import { Call } from './call.schema';
import { FileService } from 'src/file/file.service';

@Injectable()
export class CallService {
  constructor(
    private readonly callRepository: CallRepository,
    private readonly fileService: FileService,
    private readonly logger: Logger,
  ) {}

  static isCompleted(call: Call): boolean {
    return !!(call.name && call.location && call.emotional_tone && call.text);
  }

  async getById(id: string): Promise<Call & { isCompleted: boolean }> {
    const result = await this.callRepository.getById(id);

    if (!result) {
      throw new NotFoundException('Unknown call id');
    }

    const fileResponse = {
      isCompleted: CallService.isCompleted(result),
      id: result.id,
      name: result.name,
      location: result.location,
      emotional_tone: result.emotional_tone,
      text: result.text,
      fileId: result.fileId,
      url: result.url,
    };

    this.logger.log(`fileResponse: ${JSON.stringify(fileResponse, null, 2)}`);

    return fileResponse;
  }

  async create(call: CreateCallDto): Promise<{ id: string }> {
    const uuid = uuidv4();
    // we are sure here that url is valid, it's validated before
    this.logger.log(
      `Saving the file uuid: ${uuid}, call: ${JSON.stringify(call, null, 2)}`,
    );
    const saveFileResult = await this.fileService.saveFile(
      uuid,
      call.audio_url,
    );
    this.logger.log(
      `Save File Result: ${JSON.stringify(saveFileResult, null, 2)}`,
    );

    const result = await this.callRepository.create({
      id: uuid,
      fileId: saveFileResult.fileId,
      url: call.audio_url,
    });

    const createdCall = {
      id: result.id,
      name: result.name,
      location: result.location,
      emotional_tone: result.emotional_tone,
      text: result.text,
      fileId: result.fileId,
    };

    this.logger.log(`createdCall: ${JSON.stringify(createdCall, null, 2)}`);

    return { id: result.id };
  }
}
