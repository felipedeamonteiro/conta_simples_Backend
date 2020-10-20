import { getRepository, Repository } from 'typeorm';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';

import Transaction from '../entities/Transaction';

class TransactionRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async findTransactionBySameCard(
    card_number: string,
  ): Promise<Transaction[] | undefined> {
    const findTransaction = await this.ormRepository.find({
      where: { card_number },
    });

    return findTransaction;
  }

  public async create({
    company_id,
    title,
    description,
    card_number,
    currency,
    transaction_type,
    date,
    total_value,
    instalments,
    instalment_value,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      company_id,
      title,
      description,
      card_number,
      currency,
      transaction_type,
      date,
      total_value,
      instalments,
      instalment_value,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }
}

export default TransactionRepository;
