import { EntityRepository, Repository } from 'typeorm';
import Account from '../models/Account';

import AppError from '../errors/AppError';

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
      throw new AppError('There is no account for this company.');
    }

    const { balance } = account;

    return balance;
  }
}

export default AccountRepository;
