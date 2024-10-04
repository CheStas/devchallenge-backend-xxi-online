import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CallService } from '../call/call.service';
import { commands } from '../queue/command';
import { OrchestrationService } from '../queue/orchestration.service';

@Injectable()
@Processor(commands.CATEGORY_UPDATE_RESOLVE)
export class CategoryUpdateResolverProcessor extends WorkerHost {
  constructor(
    private readonly callService: CallService,
    private readonly orchestrationService: OrchestrationService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<{ callId: string }, { callId: string }, any>) {
    // Get all calls, for each call
    // - remove current category (or just set status in progress?)
    // - emit send CATEGORY_CLASSIFY_TEXT command
    const calls = await this.callService.getAll();
    for (const call of calls) {
      this.orchestrationService.sendCategoryClassifyCommand({
        callId: call.id,
      });
    }
  }
}
