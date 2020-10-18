import { EntityRepository, Repository } from 'typeorm';
import Account from '../models/Account';

interface IBalance {
  balance: number;
}

@EntityRepository(Account)
class AccountRepository extends Repository<Account> {
  /**
   * getBalance
   */
  public async getBalance(company_id: string): Promise<IBalance> {
    const account = await this.find({
      where: { company_id },
    });

    const { balance } = account;

    return balance;
  }
}

export default AccountRepository;
