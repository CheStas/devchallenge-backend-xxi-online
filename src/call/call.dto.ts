import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCallDto {
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    audio_url: string;
}