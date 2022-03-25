import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
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

export class CreateMemberDto {
  @IsNotEmpty()
  @IsEnum(MemberType)
  member_type: MemberType;

  @IsNotEmpty()
  @IsEnum(MemberSubType)
  member_sub_type: MemberSubType;

  @IsOptional()
  profile_picture: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsOptional()
  middle_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  primary_degree: string;

  @IsOptional()
  secondary_degree: string;

  @IsNotEmpty()
  @IsString()
  primary_specialty: string;

  @IsOptional()
  secondary_specialty: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

//   @IsDate()
//   @IsOptional()
//   date_of_birth: Date;

  @IsString()
  @IsOptional()
  date_of_birth: string;

  @IsNotEmpty()
  @IsEmail()
  primary_email_address: string;

  @IsEmail()
  @IsOptional()
  secondary_email_address: string;

  @IsBoolean()
  @IsOptional()
  email_address_visible: boolean;

  @IsNotEmpty()
  @IsBoolean()
  newsletter: boolean;

  @IsOptional()
  region: string;

  @IsOptional()
  job_title: string;

  @IsBoolean()
  @IsOptional()
  feature_profile: boolean;

  @IsOptional()
  medical_license_number: string;

  @IsOptional()
  individual_NPI_number: string;

  @IsOptional()
  practice_type: string;

  @IsOptional()
  website: string;

  @IsOptional()
  detailed_bio: string;

  @IsOptional()
  organization_1: string;

  @IsOptional()
  organization_2: string;

  @IsOptional()
  organization_3: string;

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

  @IsOptional()
  residency_institution: string;

  @IsInt()
  @IsOptional()
  residency_institution_start_year: number;

  @IsInt()
  @IsOptional()
  residency_institution_end_year: number;

  @IsOptional()
  fellowship_institution: string;

  @IsInt()
  @IsOptional()
  fellowship_start_year: number;

  @IsInt()
  @IsOptional()
  fellowship_end_year: number;

  @IsNotEmpty()
  @IsBoolean()
  payment: boolean;

  @IsOptional()
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

  @IsOptional()
  attention: string;

  @IsNotEmpty()
  @IsString()
  address_1: string;

  @IsOptional()
  address_2: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsInt()
  zip_code: number;

  @IsNotEmpty()
  @IsBoolean()
  is_primary_address: boolean;

  @IsBoolean()
  @IsOptional()
  address_visible: boolean;
}

class PhoneDetails {
  @IsNotEmpty()
  @IsString()
  phone_type: string;

  @IsNotEmpty()
  @IsPhoneNumber('US')
  phone_number: string;

  @IsInt()
  @IsOptional()
  extension: number;

  @IsBoolean()
  @IsOptional()
  phone_visible: boolean;
}

class EducationDetails {
  @IsNotEmpty()
  @IsString()
  degree: string;

  @IsNotEmpty()
  @IsString()
  medical_school_name: string;

  @IsNotEmpty()
  @IsInt()
  medical_school_start_year: number;

  @IsNotEmpty()
  @IsInt()
  medical_school_end_year: number;
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

  @IsOptional()
  copy_address_from: string;

  @IsNotEmpty()
  @IsString()
  billing_address_one: string;

  @IsOptional()
  billing_address_two: string;

  @IsNotEmpty()
  @IsString()
  billing_address_city: string;

  @IsNotEmpty()
  @IsString()
  billing_address_state: string;

  @IsNotEmpty()
  @IsInt()
  billing_address_zip: number;
}
