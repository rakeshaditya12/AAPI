import { CardType } from 'src/constants/card-type.enum';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Members } from './members.entity';

@Entity('members_payment', { schema: 'public' })
export class MembersPayment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 255 })
  card_holder_name: string;

  @Column({ type: 'enum', enum: CardType, default: CardType.AmericanExpress })
  card_type: CardType;

  @Column({ type: 'int' })
  card_number: number;

  @Column('character varying', { length: 255 })
  card_expiration_date: string;

  @Column({ type: 'int' })
  card_cvv_number: number;

  @Column({ type: 'int' })
  amount: number;

  @Column('character varying', { length: 255, default: null })
  copy_address_from: string;

  @Column('character varying', { length: 255 })
  billing_address_one: string;

  @Column('character varying', { length: 255, default: null })
  billing_address_two: string;

  @Column('character varying', { length: 255 })
  billing_address_city: string;

  @Column('character varying', { length: 255 })
  billing_address_state: string;

  @Column({ type: 'int' })
  billing_address_zip: number;

  @Column()
  member_id: string;

  @ManyToOne(() => Members, (member) => member.payment, { onDelete: 'CASCADE' })
  @JoinColumn()
  member: Members;
}
