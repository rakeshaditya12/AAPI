import { IsNotEmpty, IsOptional } from 'class-validator';

export class SearchMemberDto {
  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;
}
