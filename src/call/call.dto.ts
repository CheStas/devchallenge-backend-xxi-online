import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCallDto {
    @IsNotEmpty()
    @IsString()
    audio_url: string;
}