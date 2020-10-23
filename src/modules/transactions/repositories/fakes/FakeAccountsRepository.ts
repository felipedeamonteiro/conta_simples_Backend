import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';
import IAccountsRepository from '@modules/transactions/repositories/IAccountsRepository';
import ICreateAccountDTO from '@modules/transactions/dtos/ICreateAccountDTO';
import Account from '../../infra/typeorm/entities/Account';

class FakeAccountRepository implements IAccountsRepository {
  private accounts: Account[] = [];

  public async getBalance(company_id: string): Promise<number> {
    const accountData = this.accounts.find(
      account => account.company_id === company_id,
    );

    if (!accountData) {
      throw new AppError('There is no account for this company.');
    }

    return accountData.balance;
  }

  public async createAccount(data: ICreateAccountDTO): Promise<Account> {
    const checkAccountExists = this.accounts.find(
      accountData => accountData.company_id === data.company_id,
    );

    if (checkAccountExists) {
      throw new AppError('Company account already exists.');
    }

    const account = new Account();

    Object.assign(account, {
      id: uuid(),
      company_id: data.company_id,
      balance: 0,
    });

    return account;
  }
}

export default FakeAccountRepository;
