import {
  EntityRepository,
  Repository,
  getCustomRepository,
  getRepository,
} from 'typeorm';
import Account from '../models/Account';
import Transaction from '../models/Transaction';
import CreditCard from '../models/CreditCard';

import TransactionsRepository from './TransactionsRepository';

interface IBalance {
  account_total: number;
  current_limit: number;
}

@EntityRepository(Account)
class AccountRepository extends Repository<Account> {
  /**
   * getBalance
   */
  public async getBalance(company_id: string): Promise<number> {
    const account = await this.findOne({
      where: { company_id },
    });

    if (!account) {
      throw new Error('There is no account for this company.');
    }

    const { balance } = account;

    return balance;
  }

  public async calculateBalance(
    company_id: string,
    creditCardNumber: number,
  ): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const creditCardRepository = getRepository(CreditCard);

    const creditCard = await creditCardRepository.findOne({
      where: { company_id, creditCardNumber },
    });

    const transactions = await transactionsRepository.find({
      where: { company_id },
    });
    const account = await this.findOne({
      where: { company_id },
    });

    if (!account) {
      throw new Error('This account does not exist');
    }

    const { account_total, current_limit } = transactions.reduce(
      (accumulator: IBalance, transaction: Transaction) => {
        switch (transaction.transaction_type) {
          case 'Income':
            accumulator.account_total += transaction.total_value;
            this.save({
              balance: accumulator.account_total,
            });
            break;
          case 'Debit':
            if (account_total < transaction.total_value) {
              throw new Error(
                'You do not have enough balance to make this transaction.',
              );
            }
            accumulator.account_total -= transaction.total_value;
            this.save({
              balance: accumulator.account_total,
            });
            break;
          case 'Credit':
            if (current_limit < transaction.total_value) {
              throw new Error(
                'You do not have enough limit to make this transaction.',
              );
            }
            accumulator.current_limit -= transaction.total_value;
            if (creditCard) {
              creditCardRepository.save({
                current_limit: accumulator.current_limit,
              });
            }
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        account_total: account.balance,
        current_limit: creditCard ? creditCard.current_limit : 0,
      },
    );
  }
}

export default AccountRepository;
