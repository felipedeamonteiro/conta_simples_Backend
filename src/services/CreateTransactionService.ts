import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Account from '../models/Account';

import TransactionRepository from '../repositories/TransactionsRepository';

interface IRequest {
  company_id: string;
  title: string;
  description?: string;
  card_number: string;
  currency: string;
  transaction_type: string;
  date: Date;
  total_value: string;
  instalments?: number;
}

class CreateTransactionService {
  public async execute({
    company_id,
    title,
    description,
    card_number,
    currency,
    total_value,
    instalments = 1,
    transaction_type,
    date,
  }: IRequest): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const accountRepository = getCustomRepository(Account);

    const balance = accountRepository.getBalance(company_id);

    if (transaction_type === 'Credit' && instalments > 1) {
      instalment_value = (Number(total_value) / instalments).toString;
    }

    const transaction = transactionRepository.create({
      title,
      description,
      card_number,
      currency,
      transaction_type,
      date,
      total_value,
      instalments,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
