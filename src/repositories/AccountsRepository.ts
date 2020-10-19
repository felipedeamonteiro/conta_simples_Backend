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
  income: number;
  debit_outcome: number;
  credit_outcome: number;
  account_total: number;
  current_limit: number;
}

@EntityRepository(Account)
class AccountRepository extends Repository<Account> {
  /**
   * getBalance
   */
  public async getBalance(
    company_id: string,
    credit_card_number?: number,
  ): Promise<IBalance> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const creditCardRepository = getRepository(CreditCard);

    const creditCard = await creditCardRepository.findOne({
      where: { company_id, credit_card_number },
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

    const {
      income,
      debit_outcome,
      credit_outcome,
      account_total,
      current_limit,
    } = transactions.reduce(
      (accumulator: IBalance, transaction: Transaction) => {
        switch (transaction.transaction_type) {
          case 'Income':
            accumulator.income += transaction.total_value;
            accumulator.account_total += accumulator.income;
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
            accumulator.debit_outcome += transaction.total_value;
            accumulator.account_total -= accumulator.debit_outcome;
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
            accumulator.credit_outcome += transaction.total_value;
            accumulator.current_limit -= accumulator.credit_outcome;
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
        income: 0,
        debit_outcome: 0,
        credit_outcome: 0,
        account_total: account.balance,
        current_limit: creditCard ? creditCard.current_limit : 0,
      },
    );

    return {
      income,
      debit_outcome,
      credit_outcome,
      account_total,
      current_limit,
    };
  }
}

export default AccountRepository;
