import { getCustomRepository } from 'typeorm';

import Transaction from '../../models/Transaction';

import TransactionRepository from '../../repositories/TransactionsRepository';
import AccountRepository from '../../repositories/AccountsRepository';

interface IRequest {
  company_id: string;
  title: string;
  description?: string;
  card_number?: number;
  currency: string;
  transaction_type: 'Credit' | 'Debit' | 'Income';
  date: Date;
  total_value: number;
  instalments?: number;
}

class CreateTransactionService {
  public async execute({
    company_id,
    title,
    description,
    card_number,
    currency,
    transaction_type,
    date,
    total_value,
    instalments,
  }: IRequest): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const accountRepository = getCustomRepository(AccountRepository);

    const transaction = transactionRepository.create({
      company_id,
      title,
      description,
      card_number,
      currency,
      transaction_type,
      date,
      total_value,
      instalments,
    });

    await accountRepository.getBalance(company_id, card_number);

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
