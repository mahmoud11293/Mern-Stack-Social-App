import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  removeImage?: string;
}
