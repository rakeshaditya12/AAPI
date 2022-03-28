import { IsEmail, IsNotEmpty } from 'class-validator';

export class AvailableMemberDto {
  @IsNotEmpty()
  @IsEmail()
  uname: string;
}
