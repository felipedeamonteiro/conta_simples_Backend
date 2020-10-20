import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';

import AccountRepository from '../../repositories/AccountsRepository';

class GetBalanceService {
  public async execute(company_id: string): Promise<number> {
    const accountRepository = getCustomRepository(AccountRepository);

    const accountBalance = await accountRepository.getBalance(company_id);

    if (!accountBalance) {
      throw new Error('Company balance does not exist.');
    }

    return accountBalance;
  }
}

export default GetBalanceService;
