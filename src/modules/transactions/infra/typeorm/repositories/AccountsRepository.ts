import { EntityRepository, getRepository, Repository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import IAccountsRepository from '@modules/transactions/repositories/IAccountsRepository';
import Account from '../entities/Account';
import ICreateAccountDTO from '../../../dtos/ICreateAccountDTO';

@EntityRepository(Account)
class AccountRepository implements IAccountsRepository {
  private ormRepository: Repository<Account>;

  constructor() {
    this.ormRepository = getRepository(Account);
  }

  public async getBalance(company_id: string): Promise<number> {
    const account = await this.ormRepository.findOne({
      where: { company_id },
    });

    if (!account) {
      throw new AppError('There is no account for this company.');
    }

    const { balance } = account;

    return balance;
  }

  public async createAccount(data: ICreateAccountDTO): Promise<Account> {
    const checkAccountExists = await this.ormRepository.findOne({
      where: { company_id: data.company_id },
    });

    if (checkAccountExists) {
      throw new AppError('Company account already exists.');
    }

    const account = this.ormRepository.create({
      company_id: data.company_id,
      balance: data.balance,
    });

    await this.ormRepository.save(account);

    return account;
  }
}

export default AccountRepository;
