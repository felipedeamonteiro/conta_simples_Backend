import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';

import AccountRepository from '../../repositories/AccountsRepository';

import AppError from '../../errors/AppError';

class GetBalanceService {
  public async execute(company_id: string): Promise<number> {
    const accountRepository = getCustomRepository(AccountRepository);

    const accountBalance = await accountRepository.getBalance(company_id);

    if (!accountBalance) {
      throw new AppError('Company balance does not exist.');
    }

    return accountBalance;
  }
}

export default GetBalanceService;
