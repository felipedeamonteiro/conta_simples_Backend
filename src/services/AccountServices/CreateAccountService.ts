import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';

import Account from '../../models/Account';

import AccountRepository from '../../repositories/AccountsRepository';

interface IRequest {
  company_id: string;
  balance: number;
}

class CreateCompanyService {
  public async execute({ company_id, balance }: IRequest): Promise<Account> {
    const accountRepository = getCustomRepository(AccountRepository);

    const checkAccountExists = await accountRepository.findOne({
      where: { company_id },
    });

    if (checkAccountExists) {
      throw new Error('Company account already exists.');
    }

    const account = accountRepository.create({
      company_id,
      balance,
    });

    await accountRepository.save(account);

    return account;
  }
}

export default CreateCompanyService;