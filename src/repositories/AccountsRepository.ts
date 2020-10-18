import { EntityRepository, Repository } from 'typeorm';
import Account from '../models/Account';

@EntityRepository(Account)
class AccountRepository extends Repository<Account> {
  /**
   * getBalance
   */
  public async getBalance(company_id: string): Promise<number> {
    const account = await this.find({
      where: { company_id },
    });

    const { balance } = account[0];

    return balance;
  }
}

export default AccountRepository;
