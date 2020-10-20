import { EntityRepository, Repository } from 'typeorm';
import Account from '../models/Account';
// import Transaction from '../models/Transaction';
// import CreditCard from '../models/CreditCard';

// import TransactionsRepository from './TransactionsRepository';

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
}

export default AccountRepository;
