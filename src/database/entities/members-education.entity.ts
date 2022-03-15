import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('members_education', { schema: 'public' })
export class MembersEducation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 255 })
  degree: string;

  @Column('character varying', { length: 255 })
  medical_school_name: string;

  @Column({ type: 'int' })
  medical_school_start_year: number;

  @Column({ type: 'int' })
  medical_school_end_year: number;

  @Column()
  member_id: string;
}
