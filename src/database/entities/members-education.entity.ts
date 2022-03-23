import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Members } from './members.entity';

@Entity('members_education', { schema: 'public' })
export class MembersEducation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 255, nullable: true })
  degree: string;

  @Column('character varying', { length: 255 })
  medical_school_name: string;

  @Column({ type: 'int', nullable: true })
  medical_school_start_year: number;

  @Column({ type: 'int', nullable: true })
  medical_school_end_year: number;

  @Column()
  member_id: string;

  @ManyToOne(() => Members, (member) => member.education, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  member: Members;
}
