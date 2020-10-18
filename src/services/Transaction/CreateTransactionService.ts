import { getCustomRepository } from 'typeorm';

import Transaction from '../../models/Transaction';
import Account from '../../models/Account';

import TransactionRepository from '../../repositories/TransactionsRepository';
import AccountRepository from '../../repositories/AccountsRepository';

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
    const accountRepository = getCustomRepository(AccountRepository);

    const account = accountRepository.findOne({ where: { company_id } });

    if (transaction_type === 'Credit' && instalments > 1) {
      instalment_value = (Number(total_value) / instalments).toString;
    }

    if (transaction_type === 'Income') {
    }

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

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
