import { EntityRepository, Repository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Account from '../entities/Account';

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

  public async createAccount({}): Promise<> {}
}

export default AccountRepository;
