import { MemberSubType } from 'src/constants/member-sub-type.enum';
import { MemberType } from 'src/constants/member-type.enum';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberTokens } from './members-token.entity';

@Entity('members', { schema: 'public' })
export class Members extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MemberType })
  member_type: string;

  @Column({ type: 'enum', enum: MemberSubType })
  member_sub_type: string;

  @Column('character varying', { length: 255 })
  profile_picture: string;

  @Column('character varying', { length: 255 })
  first_name: string;

  @Column('character varying', { length: 255, default: null })
  middle_name: string;

  @Column('character varying', { length: 255 })
  last_name: string;

  @Column('character varying', { length: 255 })
  primary_degree: string;

  @Column('character varying', { length: 255, default: null })
  secondary_degree: string;

  @Column('character varying', { length: 255 })
  primary_specialty: string;

  @Column('character varying', { length: 255, default: null })
  secondary_specialty: string;

  @Column()
  gender: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @Column()
  primary_email_address: string;

  @Column({ default: null })
  secondary_email_address: string;

  @Column({ default: false })
  email_address_visible: boolean;

  @Column({ default: true })
  newsletter: boolean;

  @Column('character varying', { length: 255, default: null })
  region: string;

  @Column('character varying', { length: 255, default: null })
  job_title: string;

  @Column({ default: false })
  feature_profile: boolean;

  @Column('character varying', { length: 255, default: null })
  medical_license_number: string;

  @Column('character varying', { length: 255, default: null })
  individual_NPI_number: string;

  @Column('character varying', { length: 255, default: null })
  practice_type: string;

  @Column('character varying', { length: 255, default: null })
  website: string;

  @Column('character varying', { length: 255, default: null })
  detailed_bio: string;

  @Column('character varying', { length: 255, default: null })
  organization_1: string;

  @Column('character varying', { length: 255, default: null })
  organization_2: string;

  @Column('character varying', { length: 255, default: null })
  organization_3: string;

  @Column('character varying', { unique: true, length: 255 })
  username: string;

  @Column('character varying', { length: 255 })
  password: string;

  // @Column({ type: 'json' })
  @Column('simple-json')
  address_details: {};

  // @Column({ type: 'json' })
  @Column('simple-json')
  phone_details: {};

  // @Column({ type: 'json' })
  @Column('simple-json')
  education_details: {};

  @Column('character varying', { length: 255, default: null })
  residency_institution: string;

  @Column({ type: 'int', default: 0 })
  residency_institution_start_year: number;

  @Column({ type: 'int', default: 0 })
  residency_institution_end_year: number;

  @Column('character varying', { length: 255, default: null })
  fellowship_institution: string;

  @Column({ type: 'int', default: 0 })
  fellowship_start_year: number;

  @Column({ type: 'int', default: 0 })
  fellowship_end_year: number;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @OneToMany(() => MemberTokens, (memberTokens) => memberTokens.members)
  memberTokens!: MemberTokens[];
}
