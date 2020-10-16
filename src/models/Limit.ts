import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('company_tokens')
class Limit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_id: string;

  @Column('decimal')
  total_limit: number;

  @Column('decimal')
  current_limit: number;

  @Column('int')
  credit_card_number: number;

  @Column()
  is_debit: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Limit;
