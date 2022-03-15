import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('members_phone', { schema: 'public' })
export class MembersPhone extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 255 })
  phone_type: string;

  @Column('character varying', { length: 255 })
  phone_number: string;

  @Column({ type: 'int', default: 0 })
  extension: number;

  @Column({ default: false })
  phone_visible: boolean;

  @Column()
  member_id: string;
}
