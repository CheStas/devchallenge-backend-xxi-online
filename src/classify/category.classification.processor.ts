import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import * as transformers from 'transformers.ts';
import { Job } from 'bullmq';
import { CallService } from '../call/call.service';
import { commands } from '../queue/command';
import { OrchestrationService } from '../queue/orchestration.service';
import { CategoryService } from '../category/category.service';

const { pipeline } = transformers;

@Injectable()
@Processor(commands.CATEGORY_CLASSIFY_TEXT)
// Neutral, Positive, Negative, Angry
export class CategoryClassificationProcessor extends WorkerHost {
  task = 'zero-shot-classification';
  model = 'Xenova/mobilebert-uncased-mnli';

  constructor(
    private readonly callService: CallService,
    private readonly categoryService: CategoryService,
    private readonly orchestrationService: OrchestrationService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async process(job: Job<{ callId: string }, { callId: string }, any>) {
    const { callId } = job.data;
    const log = (msg: string) => {
      job.log(msg);
      this.logger.log(msg);
    };
    log(`Category Classification text in call ${callId}`);
    const { text } = await this.callService.getById(callId);
    const categories = await this.categoryService.getAllRaw();
    const categoriesList = categories.map((category) => category.title);

    const pipe: any = await pipeline(this.task, this.model, {
      // progress_callback: (progress) =>
      //   log(
      //     `Category Classification Progress: ${JSON.stringify(
      //       progress,
      //       null,
      //       2,
      //     )}`,
      //   ),
    });
    const result = await pipe(text, categoriesList);

    log(`Category Classified , ${JSON.stringify(result, null, 2)}}`);

    const categoriesToSet =
      result?.labels?.map((label) => {
        return categories.find((category) => category.title === label);
      }) || [];

    log(`Categories to set: ${JSON.stringify(categoriesToSet, null, 2)}`);

    const updateResult = await this.callService.update(callId, {
      categories: categoriesToSet,
    });

    log(`Call Updated: ${JSON.stringify(updateResult, null, 2)}`);
  }

  private matchLabel(label: string) {}
}
