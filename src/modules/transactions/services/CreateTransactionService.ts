import { parseISO } from 'date-fns';

import CalculateBalanceAndLimitService from '@modules/company/services/CalculateBalanceAndLimitService';
import AppError from '@shared/errors/AppError';
import AccountRepository from '@modules/company/repositories/AccountsRepository';
import Transaction from '../infra/typeorm/entities/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';
import CreditCard from '../infra/typeorm/entities/CreditCard';
import ITransactionRepository from '../repositories/ITransactionsRepository';
import ICreditCardsRepository from '../repositories/ICreditCardsRepository';

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
  constructor(
    private transactionRepository: ITransactionRepository,
    private creditCardRepository: ICreditCardsRepository,
    private accountRepository: IAccountRepository,
  ) {}

  public async execute({
    company_id,
    title,
    description,
    card_number = 0,
    currency,
    transaction_type,
    date,
    total_value,
    instalments = 1,
  }: IRequest): Promise<Transaction> {
    const accountRepository = getCustomRepository(AccountRepository);
    const creditCardRepository = getRepository(CreditCard);

    const calculateBalanceAndLimitService = new CalculateBalanceAndLimitService();

    const creditCard = await creditCardRepository.findOne({
      where: { company_id, credit_card_number: card_number },
    });

    if (!creditCard && transaction_type !== 'Income') {
      throw new AppError(
        'This card does not exist. Try with another card or create one.',
      );
    }

    await calculateBalanceAndLimitService.execute(
      company_id,
      creditCard?.credit_card_number,
    );

    const accountData = await accountRepository.findOne({
      where: { company_id },
    });

    if (!accountData) {
      throw new AppError(
        'First you need to create an account to have balance.',
      );
    }

    const { balance } = accountData;
    const creditCardLimit = creditCard?.current_limit;

    const parsedDate = parseISO(date);

    if (transaction_type === 'Credit' && creditCardLimit) {
      if (creditCardLimit < total_value) {
        throw new AppError(
          'You do not have enough limit to make this transaction.',
        );
      }
      const transaction = await this.transactionRepository.create({
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

      await calculateBalanceAndLimitService.execute(
        company_id,
        creditCard?.credit_card_number,
      );

      return transaction;
    }

    if ((!balance || balance < total_value) && transaction_type !== 'Income') {
      throw new AppError(
        'You do not have enough balance to make this transaction.',
      );
    }

    const transaction = await this.transactionRepository.create({
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

    await calculateBalanceAndLimitService.execute(
      company_id,
      creditCard?.credit_card_number,
    );

    return transaction;
  }
}

export default CreateTransactionService;
