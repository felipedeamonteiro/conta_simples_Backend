/* eslint-disable no-case-declarations */
import 'reflect-metadata';
import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import CreditCard from '@modules/transactions/infra/typeorm/entities/CreditCard';

import TransactionsRepository from '@modules/transactions/repositories/TransactionsRepository';
import AccountRepository from '../repositories/AccountsRepository';

class CalculateBalanceAndLimitService {
  public async execute(
    company_id: string,
    creditCardNumber?: number,
  ): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const creditCardRepository = getRepository(CreditCard);
    const accountRepository = getCustomRepository(AccountRepository);

    const creditCard = creditCardNumber
      ? await creditCardRepository.findOne({
          where: { company_id, creditCardNumber },
        })
      : undefined;

    const transactions = await transactionsRepository.find({
      where: { company_id },
    });
    const account = await accountRepository.findOne({
      where: { company_id },
    });

    if (!account) {
      throw new AppError('This account does not exist');
    }

    const lastTransaction = transactions[transactions.length - 1];
    console.log(lastTransaction);

    const calculateBalanceBasedOnLastTransaction = async () => {
      switch (lastTransaction.transaction_type) {
        case 'Income':
          const newBalanceIncome =
            account.balance + lastTransaction.total_value;
          const incomeBalance = accountRepository.create({
            company_id,
            balance: newBalanceIncome,
          });
          await accountRepository.save(incomeBalance);
          break;
        case 'Debit':
          if (account.balance < lastTransaction.total_value) {
            throw new AppError(
              'You do not have enough balance to make this transaction.',
            );
          }
          const newBalanceDebit = account.balance - lastTransaction.total_value;
          const debitBalance = accountRepository.create({
            company_id,
            balance: newBalanceDebit,
          });
          await accountRepository.save(debitBalance);
          break;
        case 'Credit':
          if (!creditCard) {
            throw new AppError(
              'You do not have a credit card to make this transaction.',
            );
          }
          if (creditCard.current_limit < lastTransaction.total_value) {
            throw new AppError(
              'You do not have enough limit to make this transaction.',
            );
          }
          const newBalanceCredit =
            creditCard.current_limit - lastTransaction.total_value;
          const creditBalance = accountRepository.create({
            company_id,
            balance: newBalanceCredit,
          });
          await creditCardRepository.save(creditBalance);
          break;
        default:
          break;
      }
    };
    calculateBalanceBasedOnLastTransaction();
  }
}

export default CalculateBalanceAndLimitService;
