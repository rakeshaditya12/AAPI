import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CardType } from 'src/constants/card-type.enum';
import { MemberSubType } from 'src/constants/member-sub-type.enum';
import { MemberType } from 'src/constants/member-type.enum';
import { Match } from 'src/decorators/match.decorators';

export class CreateQuickMemberDto {
  @IsNotEmpty()
  @IsBoolean()
  qucik_registration: boolean;

  @IsNotEmpty()
  @IsEnum(MemberType)
  member_type: MemberType;

  @IsNotEmpty()
  @IsEnum(MemberSubType)
  member_sub_type: MemberSubType;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  primary_degree: string;

  @IsNotEmpty()
  @IsString()
  primary_specialty: string;

  @IsNotEmpty()
  @IsEmail()
  primary_email_address: string;

  @IsOptional()
  state_of_medical_licence: string;

  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(25)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(25)
  @Match('password')
  confirm_password: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddressDetails)
  address_details: AddressDetails[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PhoneDetails)
  phone_details: PhoneDetails[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EducationDetails)
  education_details: EducationDetails[];

  @IsNotEmpty()
  @IsBoolean()
  payment: boolean;

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @ValidateIf((obj) => obj.payment)
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PaymentDetails)
  payment_details: PaymentDetails[];
}

class AddressDetails {
  @IsNotEmpty()
  @IsString()
  address_type: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsInt()
  zip_code: number;
}

class PhoneDetails {
  @IsNotEmpty()
  @IsString()
  phone_type: string;

  @IsNotEmpty()
  @IsPhoneNumber('US')
  phone_number: string;
}

class EducationDetails {
  @IsNotEmpty()
  @IsString()
  medical_school_name: string;
}

class PaymentDetails {
  @IsNotEmpty()
  @IsString()
  card_holder_name: string;

  @IsNotEmpty()
  @IsEnum(CardType)
  card_type: CardType;

  @IsNotEmpty()
  @IsInt()
  card_number: number;

  @IsNotEmpty()
  @IsString()
  card_expiration_date: string;

  @IsNotEmpty()
  @IsInt()
  card_cvv_number: number;

  @IsNotEmpty()
  @IsInt()
  amount: number;
}
