import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchMemberDto {
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;
}
