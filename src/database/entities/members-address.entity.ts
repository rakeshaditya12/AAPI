import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Members } from './members.entity';

@Entity('members_address', { schema: 'public' })
export class MembersAddress extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 255 })
  address_type: string;

  @Column('character varying', { length: 255, nullable: true })
  attention: string;

  @Column('character varying', { length: 255 })
  address_1: string;

  @Column('character varying', { length: 255, nullable: true })
  address_2: string;

  @Column('character varying', { length: 255 })
  city: string;

  @Column('character varying', { length: 255 })
  state: string;

  @Column('character varying', { length: 255, default: 'United States' })
  country: string;

  @Column({ type: 'int' })
  zip_code: number;

  @Column({ default: false })
  is_primary_address: boolean;

  @Column({ default: false })
  address_visible: boolean;

  @Column()
  member_id: string;

  // @Column()
  // memberId: string;

  @ManyToOne(() => Members, (member) => member.address, { onDelete: 'CASCADE' })
  @JoinColumn()
  member: Members;
}
