import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Members } from './members.entity';

@Entity('members_phone', { schema: 'public' })
export class MembersPhone extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 255 })
  phone_type: string;

  @Column('character varying', { length: 255 })
  phone_number: string;

  @Column({ type: 'int', nullable: true })
  extension: number;

  @Column({ default: false })
  phone_visible: boolean;

  @Column()
  member_id: string;

  @ManyToOne(() => Members, (member) => member.phone, { onDelete: 'CASCADE' })
  @JoinColumn()
  member: Members;
}
