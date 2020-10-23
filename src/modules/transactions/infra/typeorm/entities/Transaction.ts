import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Company from '@modules/companies/infra/typeorm/entities/Company';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  title: string;

  @Column('timestamp with time zone')
  date: Date;

  @Column()
  description: string;

  @Column()
  transaction_type: 'Credit' | 'Debit' | 'Income';

  @Column('int')
  card_number: number;

  @Column()
  currency: string;

  @Column('decimal')
  total_value: number;

  @Column('int')
  instalments: number;

  @Column('decimal')
  instalment_value: number | undefined;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
