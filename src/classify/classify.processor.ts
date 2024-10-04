import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import * as transformers from 'transformers.ts';
import { Job } from 'bullmq';
import { CallService } from '../call/call.service';
import { commands } from '../queue/command';
import { OrchestrationService } from '../queue/orchestration.service';

const { pipeline } = transformers;

@Injectable()
@Processor(commands.CLASSIFY_TEXT)
// Neutral, Positive, Negative, Angry
export class ClassificationProcessor extends WorkerHost {
  task: any = 'text-classification';
  // only negative, positive
  // model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  // Negative; 1 -> Neutral; 2 -> Positive
  model = 'Xenova/twitter-roberta-base-sentiment-latest';

  constructor(
    private readonly callService: CallService,
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
    log(`Classify text in call ${callId}`);
    const { text } = await this.callService.getById(callId);

    const classifier = await pipeline(this.task, this.model, {
      // progress_callback: (progress) =>
      //   log(`Progress: ${JSON.stringify(progress, null, 2)}`),
    });
    const result = await classifier(text);

    log(`Text Classified, ${JSON.stringify(result, null, 2)}}`);
    const label = result?.[0]?.label;
    const emotional_tone = this.matchLabel(label);

    if (label) {
      log(`Update Matched Emotion Tone ${emotional_tone}`);
    } else {
      log(`No Labels In Response, Set Default ${emotional_tone}`);
    }

    await this.callService.update(callId, { emotional_tone });
    log(`Call Updated`);
  }

  private matchLabel(labelRaw: string) {
    const label = labelRaw?.toUpperCase();
    switch (label) {
      case 'NEGATIVE':
        return 'Negative';
      case 'POSITIVE':
        return 'Positive';
      case 'NEUTRAL':
        return 'Neutral';
      case 'ANGRY':
        return 'Angry';
      default:
        return 'Neutral';
    }
  }
}
