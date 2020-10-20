/* eslint-disable no-case-declarations */
import 'reflect-metadata';
import { getCustomRepository, getRepository } from 'typeorm';

import CreditCard from '../../models/CreditCard';

import AccountRepository from '../../repositories/AccountsRepository';
import TransactionsRepository from '../../repositories/TransactionsRepository';

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
      throw new Error('This account does not exist');
    }

    const lastTransaction = transactions[transactions.length - 1];

    const calculateBalanceBasedOnLastTransaction = async () => {
      switch (lastTransaction.transaction_type) {
        case 'Income':
          const newBalanceIncome =
            account.balance + lastTransaction.total_value;
          await accountRepository.save({
            balance: newBalanceIncome,
          });
          break;
        case 'Debit':
          if (account.balance < lastTransaction.total_value) {
            throw new Error(
              'You do not have enough balance to make this transaction.',
            );
          }
          const newBalanceDebit = account.balance - lastTransaction.total_value;
          await accountRepository.save({
            balance: newBalanceDebit,
          });
          break;
        case 'Credit':
          if (!creditCard) {
            throw new Error(
              'You do not have a credit card to make this transaction.',
            );
          }
          if (creditCard.current_limit < lastTransaction.total_value) {
            throw new Error(
              'You do not have enough limit to make this transaction.',
            );
          }
          const newBalanceCredit =
            creditCard.current_limit - lastTransaction.total_value;
          await creditCardRepository.save({
            current_limit: newBalanceCredit,
          });
          break;
        default:
          break;
      }
    };
    await calculateBalanceBasedOnLastTransaction();
  }
}

export default CalculateBalanceAndLimitService;
