import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { commands } from './command';
import { Queue } from 'bullmq';

@Injectable()
export class OrchestrationService {
  constructor(
    private readonly logger: Logger,
    @InjectQueue(commands.TRANSCRIBE_CALL)
    private readonly transcribeQueue: Queue,
    @InjectQueue(commands.CLASSIFY_TEXT)
    private readonly classifyQueue: Queue,
    @InjectQueue(commands.TOKENIZE_TEXT)
    private readonly tokenizeQueue: Queue,
    @InjectQueue(commands.CATEGORY_CLASSIFY_TEXT)
    private readonly categoryClassifyQueue: Queue,
    @InjectQueue(commands.CATEGORY_UPDATE_RESOLVE)
    private readonly categoryUpdateResolveQueue: Queue,
  ) {}

  async emitCallUploadedEvent({ callId }: { callId: string }) {
    this.logger.log(`Adding call to transcribe ${callId}`);
    await this.transcribeQueue.add(commands.TRANSCRIBE_CALL, { callId });
  }

  async emitCallTranscribedEvent({ callId }: { callId: string }) {
    this.logger.log(
      `File Transcribed, sending text to Classify, Tokenize, Category Classify Queues  ${callId}`,
    );
    await this.classifyQueue.add(commands.CLASSIFY_TEXT, { callId });
    await this.tokenizeQueue.add(commands.TOKENIZE_TEXT, { callId });
    await this.categoryClassifyQueue.add(commands.CATEGORY_CLASSIFY_TEXT, {
      callId,
    });
  }

  async sendCategoryClassifyCommand({ callId }: { callId: string }) {
    await this.categoryClassifyQueue.add(commands.CATEGORY_CLASSIFY_TEXT, {
      callId,
    });
  }

  async emitTextTokenizedEvent({ callId }: { callId: string }) {
    this.logger.log(`File Tokenized ${callId}`);
  }

  async emitTextClassifiedEvent({ callId }: { callId: string }) {
    this.logger.log(`File Classified ${callId}`);
  }

  async emitTextCategoryClassifiedEvent({ callId }: { callId: string }) {
    this.logger.log(`Call CategoryClassified ${callId}`);
  }

  async emitCategoryAddedEvent({ categoryId }: { categoryId: string }) {
    this.logger.log(`Category Added ${categoryId}`);
    // Get all calls, for each call
    // - remove current category (or just set status in progress?)
    // - emit send CATEGORY_CLASSIFY_TEXT command
    await this.categoryUpdateResolveQueue.add(
      commands.CATEGORY_UPDATE_RESOLVE,
      {
        categoryId,
      },
    );
  }

  async emitCategoryUpdatedEvent({ categoryId }: { categoryId: string }) {
    this.logger.log(`Category Updated ${categoryId}`);
    // Get all calls, for each call
    // - remove current category (or just set status in progress?)
    // - emit send CATEGORY_CLASSIFY_TEXT command
    await this.categoryUpdateResolveQueue.add(
      commands.CATEGORY_UPDATE_RESOLVE,
      {
        categoryId,
      },
    );
  }

  async emitCategoryDeletedEvent({ categoryId }: { categoryId: string }) {
    this.logger.log(`Category Deleted ${categoryId}`);
    // Get all calls, for each call
    // - remove current category (or just set status in progress?)
    // - emit send CATEGORY_CLASSIFY_TEXT command
    await this.categoryUpdateResolveQueue.add(
      commands.CATEGORY_UPDATE_RESOLVE,
      {
        categoryId,
      },
    );
  }
}
