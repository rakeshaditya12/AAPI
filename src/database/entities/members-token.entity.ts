import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Members } from './members.entity';

@Entity('member_tokens', { schema: 'public' })
export class MemberTokens extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { nullable: false })
  tokenId!: string;

  @Column('integer', { nullable: false })
  expiresIn!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @ManyToOne(() => Members, (members) => members.memberTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  members!: Members;
}
