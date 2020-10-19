import { getCustomRepository, getRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import Transaction from '../../models/Transaction';

import TransactionRepository from '../../repositories/TransactionsRepository';
import AccountRepository from '../../repositories/AccountsRepository';
import CreditCard from '../../models/CreditCard';

interface IRequest {
  company_id: string;
  title: string;
  description?: string;
  card_number?: number;
  currency: string;
  transaction_type: 'Credit' | 'Debit' | 'Income';
  date: string;
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
    instalments = 1,
  }: IRequest): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const accountRepository = getCustomRepository(AccountRepository);
    const creditCardRepository = getRepository(CreditCard);

    const creditCard = await creditCardRepository.findOne({
      where: { company_id, credit_card_number: card_number },
    });

    if (!creditCard) {
      throw new Error(
        'This card does not exist. Try with another card or create one.',
      );
    }

    const parsedDate = parseISO(date);

    if (instalments && transaction_type === 'Credit' && instalments > 1) {
      const transaction = transactionRepository.create({
        company_id,
        title,
        description,
        card_number,
        currency,
        transaction_type,
        date: parsedDate,
        total_value,
        instalments,
        instalment_value: total_value / instalments,
      });

      await accountRepository.getBalance(company_id, card_number);

      await transactionRepository.save(transaction);
      return transaction;
    }

    const transaction = transactionRepository.create({
      company_id,
      title,
      description,
      card_number,
      currency,
      transaction_type,
      date: parsedDate,
      total_value,
      instalments,
      instalment_value: 0,
    });

    await accountRepository.getBalance(company_id, card_number);

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
