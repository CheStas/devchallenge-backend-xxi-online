import { CallService } from '../call/call.service';
import { TokenClassificationProcessor } from './token.classification.processor';
import { OrchestrationService } from '../queue/orchestration.service';
import { Logger } from '@nestjs/common';
import { mock, MockProxy } from 'jest-mock-extended';

export { TokenClassificationProcessor } from './token.classification.processor';

describe('TokenClassificationProcessor', () => {
  let processor: TokenClassificationProcessor;

  let callService: CallService = mock<CallService>({});
  let orchestrationService: OrchestrationService = mock<OrchestrationService>(
    {},
  );
  let logger: Logger = mock<Logger>({});

  beforeAll(() => {
    processor = new TokenClassificationProcessor(
      callService,
      orchestrationService,
      logger,
    );
  });

  it('should create an instance of TokenClassificationProcessor', () => {
    expect(processor).toBeInstanceOf(TokenClassificationProcessor);
  });

  it('should match Label', async () => {
    const testLabels = [
      {
        entity: 'B-PER',
        score: 0.9917492866516113,
        index: 5,
        word: 'ryan',
        start: null,
        end: null,
      },
      {
        entity: 'I-PER',
        score: 0.9929044246673584,
        index: 6,
        word: 'bart',
        start: null,
        end: null,
      },
      {
        entity: 'I-PER',
        score: 0.972488522529602,
        index: 7,
        word: '##os',
        start: null,
        end: null,
      },
      {
        entity: 'B-PER',
        score: 0.9813802242279053,
        index: 13,
        word: 'natalie',
        start: null,
        end: null,
      },
      {
        entity: 'I-PER',
        score: 0.9775955080986023,
        index: 14,
        word: 'jones',
        start: null,
        end: null,
      },
      {
        entity: 'I-PER',
        score: 0.8031793832778931,
        index: 32,
        word: 'bart',
        start: null,
        end: null,
      },
      {
        entity: 'I-PER',
        score: 0.9191360473632812,
        index: 33,
        word: '##os',
        start: null,
        end: null,
      },
      {
        entity: 'B-PER',
        score: 0.9268662929534912,
        index: 40,
        word: 'natalie',
        start: null,
        end: null,
      },
      {
        entity: 'B-LOC',
        score: 0.9680433869361877,
        index: 148,
        word: 'boston',
        start: null,
        end: null,
      },
      {
        entity: 'B-PER',
        score: 0.4399925172328949,
        index: 168,
        word: 'mr',
        start: null,
        end: null,
      },
      {
        entity: 'I-PER',
        score: 0.9657172560691833,
        index: 170,
        word: 'bart',
        start: null,
        end: null,
      },
      {
        entity: 'I-PER',
        score: 0.9291435480117798,
        index: 171,
        word: '##os',
        start: null,
        end: null,
      },
    ];
    const result = await processor['matchLabel'](testLabels);
    expect(result).toStrictEqual({
      person: 'ryan bartos, natalie jones bartos, natalie, mr bartos',
      location: 'boston',
    });
  });

  it('should handle empty entities', async () => {
    const testLabels = [];
    const result = await processor['matchLabel'](testLabels);
    expect(result).toStrictEqual({
      person: '',
      location: '',
    });
  });

  it('should handle entities without I-PER or I-LOC', async () => {
    const testLabels = [
      {
        entity: 'B-PER',
        score: 0.9917492866516113,
        index: 5,
        word: 'ryan',
        start: null,
        end: null,
      },
      {
        entity: 'B-LOC',
        score: 0.9680433869361877,
        index: 148,
        word: 'boston',
        start: null,
        end: null,
      },
    ];
    const result = await processor['matchLabel'](testLabels);
    expect(result).toStrictEqual({
      person: 'ryan',
      location: 'boston',
    });
  });

  it('should handle entities with multiple B-PER and B-LOC', async () => {
    const testLabels = [
      {
        entity: 'B-PER',
        score: 0.9917492866516113,
        index: 5,
        word: 'ryan',
        start: null,
        end: null,
      },
      {
        entity: 'B-LOC',
        score: 0.9680433869361877,
        index: 148,
        word: 'boston',
        start: null,
        end: null,
      },
      {
        entity: 'B-PER',
        score: 0.9813802242279053,
        index: 13,
        word: 'natalie',
        start: null,
        end: null,
      },
      {
        entity: 'B-LOC',
        score: 0.9680433869361877,
        index: 149,
        word: 'new york',
        start: null,
        end: null,
      },
    ];
    const result = await processor['matchLabel'](testLabels);
    expect(result).toStrictEqual({
      person: 'ryan, natalie',
      location: 'boston, new york',
    });
  });

  it('should handle entities with I-PER and I-LOC without B-PER or B-LOC', async () => {
    const testLabels = [
      {
        entity: 'I-PER',
        score: 0.9917492866516113,
        index: 5,
        word: 'ryan',
        start: null,
        end: null,
      },
      {
        entity: 'I-LOC',
        score: 0.9680433869361877,
        index: 148,
        word: 'boston',
        start: null,
        end: null,
      },
    ];
    const result = await processor['matchLabel'](testLabels);
    expect(result).toStrictEqual({
      person: 'ryan',
      location: 'boston',
    });
  });
});
