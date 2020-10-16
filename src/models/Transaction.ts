import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('company_tokens')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @Column()
  title: string;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column()
  transaction_type: string;

  @Column()
  card_number: string;

  @Column()
  currency: string;

  @Column()
  total_value: string;

  @Column()
  instalments: number;

  @Column()
  instalment_value: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
