import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCallDto } from './call.dto';

const supportedAudioFormats = ['mp3', 'wav'];
const supportedProtocols = ['http:', 'https:'];

@Injectable()
export class IsValidFileAudiUrlPipe
  implements PipeTransform<CreateCallDto, CreateCallDto>
{
  transform(value: CreateCallDto, metadata: ArgumentMetadata): CreateCallDto {
    let parsed;
    try {
      parsed = new URL(value.audio_url);
    } catch (e) {
      throw new UnprocessableEntityException('Invalid URL');
    }

    if (!supportedProtocols.includes(parsed.protocol)) {
      throw new UnprocessableEntityException(
        `Protocol is not supported, supported protocols are ${supportedProtocols.join(
          ', ',
        )}`,
      );
    }

    if (!supportedAudioFormats.includes(parsed.pathname.split('.').pop())) {
      throw new UnprocessableEntityException(
        `File Format is not supported, supported formats are ${supportedAudioFormats.join(
          ', ',
        )}`,
      );
    }

    return value;
  }
}
