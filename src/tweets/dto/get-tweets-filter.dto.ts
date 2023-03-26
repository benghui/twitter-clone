import { IsOptional, IsString } from 'class-validator';

export class GetTweetsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
