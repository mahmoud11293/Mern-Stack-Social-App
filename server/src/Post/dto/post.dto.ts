import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  body?: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  removeImage?: string;
}
