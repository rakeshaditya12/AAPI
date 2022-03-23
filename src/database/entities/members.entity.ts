import { MemberSubType } from 'src/constants/member-sub-type.enum';
import { MemberType } from 'src/constants/member-type.enum';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MembersAddress } from './members-address.entity';
import { MembersEducation } from './members-education.entity';
import { MembersPayment } from './members-payment.entity';
import { MembersPhone } from './members-phone.entity';
import { MemberTokens } from './members-token.entity';

@Entity('members', { schema: 'public' })
export class Members extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MemberType,
    default: MemberType.PracticingPhysician,
  })
  member_type: MemberType;

  @Column({ type: 'enum', enum: MemberSubType, default: MemberSubType.Annual })
  member_sub_type: MemberSubType;

  @Column('character varying', { length: 255, nullable: true })
  profile_picture: string;

  @Column('character varying', { length: 255 })
  first_name: string;

  @Column('character varying', { length: 255, nullable: true })
  middle_name: string;

  @Column('character varying', { length: 255 })
  last_name: string;

  @Column('character varying', { length: 255 })
  primary_degree: string;

  @Column('character varying', { length: 255, nullable: true })
  secondary_degree: string;

  @Column('character varying', { length: 255 })
  primary_specialty: string;

  @Column('character varying', { length: 255, nullable: true })
  secondary_specialty: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: string;

  @Column()
  primary_email_address: string;

  @Column({ nullable: true })
  secondary_email_address: string;

  @Column({ default: false })
  email_address_visible: boolean;

  @Column({ default: false })
  newsletter: boolean;

  @Column('character varying', { length: 255, nullable: true })
  region: string;

  @Column('character varying', { length: 255, nullable: true })
  job_title: string;

  @Column({ default: false })
  feature_profile: boolean;

  @Column('character varying', { length: 255, nullable: true })
  medical_license_number: string;

  @Column('character varying', { length: 255, nullable: true })
  individual_NPI_number: string;

  @Column('character varying', { length: 255, nullable: true })
  practice_type: string;

  @Column('character varying', { length: 255, nullable: true })
  website: string;

  @Column('character varying', { length: 255, nullable: true })
  detailed_bio: string;

  @Column('character varying', { length: 255, nullable: true })
  organization_1: string;

  @Column('character varying', { length: 255, nullable: true })
  organization_2: string;

  @Column('character varying', { length: 255, nullable: true })
  organization_3: string;

  @Column('character varying', { length: 255, nullable: true })
  state_of_medical_licence: string;

  @Column('character varying', { unique: true, length: 255 })
  username: string;

  @Column('character varying', { length: 255 })
  password: string;

  // // @Column({ type: 'json' })
  // @Column('simple-json')
  // address_details: {};

  // // @Column({ type: 'json' })
  // @Column('simple-json')
  // phone_details: {};

  // // @Column({ type: 'json' })
  // @Column('simple-json')
  // education_details: {};

  @Column('character varying', { length: 255, nullable: true })
  residency_institution: string;

  @Column({ type: 'int', nullable: true })
  residency_institution_start_year: number;

  @Column({ type: 'int', nullable: true })
  residency_institution_end_year: number;

  @Column('character varying', { length: 255, nullable: true })
  fellowship_institution: string;

  @Column({ type: 'int', nullable: true })
  fellowship_start_year: number;

  @Column({ type: 'int', nullable: true })
  fellowship_end_year: number;

  @Column({ type: 'int', nullable: true })
  amount: number;

  @OneToMany(() => MemberTokens, (memberTokens) => memberTokens.members)
  memberTokens!: MemberTokens[];

  @OneToMany(() => MembersAddress, (address) => address.member)
  address: MembersAddress;

  @OneToMany(() => MembersPhone, (phone) => phone.member)
  phone: MembersPhone;

  @OneToMany(() => MembersEducation, (education) => education.member)
  education: MembersEducation;

  @OneToMany(() => MembersPayment, (payment) => payment.member)
  payment: MembersPayment;
}
