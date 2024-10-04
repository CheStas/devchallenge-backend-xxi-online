import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import * as transformers from 'transformers.ts';
import { Job } from 'bullmq';
import { CallService } from '../call/call.service';
import { commands } from '../queue/command';
import { OrchestrationService } from '../queue/orchestration.service';

const { pipeline } = transformers;

@Injectable()
@Processor(commands.TOKENIZE_TEXT)
export class TokenClassificationProcessor extends WorkerHost {
  task = 'token-classification';
  model = 'Xenova/bert-base-NER-uncased';

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
    log(`Tokenize text in call ${callId}`);
    const { text } = await this.callService.getById(callId);

    const pipe: any = await pipeline(this.task, this.model, {
      // progress_callback: (progress) =>
      //   log(`Tokenize Progress: ${JSON.stringify(progress, null, 2)}`),
    });
    const result = await pipe(text);

    log(`Text Tokenized, ${JSON.stringify(result, null, 2)}}`);

    const { person, location } = this.matchLabel(result);

    await this.callService.update(callId, {
      name: person || '',
      location: location || '',
    });

    log(`Call Updated`);
  }

  private matchLabel(entities: { entity: string; word: string }[]) {
    const allPersons = [];
    const allLocations = [];

    // let currentPerson = '';
    entities.forEach(({ entity, word }) => {
      switch (entity) {
        case 'B-PER':
          allPersons.push(word);
          break;
        case 'I-PER':
          if (!allPersons.length) {
            allPersons.push(word);
            break;
          }

          if (word.startsWith('#')) {
            allPersons[allPersons.length - 1] += word.slice(
              word.lastIndexOf('#') + 1,
            );
          } else {
            allPersons[allPersons.length - 1] += ` ${word}`;
          }
          break;

        case 'B-LOC':
          allLocations.push(word);
          break;
        case 'I-LOC':
          if (!allLocations.length) {
            allLocations.push(word);
            break;
          }

          if (word.startsWith('#')) {
            allLocations[allLocations.length - 1] += word.slice(
              word.lastIndexOf('#') + 1,
            );
          } else {
            allLocations[allLocations.length - 1] += ` ${word}`;
          }
          break;
      }
    });

    const uniquePersons = Array.from(new Set(allPersons));
    const uniqueLocations = Array.from(new Set(allLocations));

    const result = {
      person: uniquePersons.join(', '),
      location: uniqueLocations.join(', '),
    };

    // Remove trailing commas and spaces
    result.person = result.person.replace(/, $/, '');
    result.location = result.location.replace(/, $/, '');

    return result;
  }
}
