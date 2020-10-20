import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';

import Account from '@modules/company/infra/typeorm/entities/Account';
import AppError from '@shared/errors/AppError';
import AccountRepository from '../repositories/AccountsRepository';

interface IRequest {
  company_id: string;
  balance: number;
}

class CreateCompanyService {
  public async execute({ company_id }: IRequest): Promise<Account> {
    const accountRepository = getCustomRepository(AccountRepository);

    const checkAccountExists = await accountRepository.findOne({
      where: { company_id },
    });

    if (checkAccountExists) {
      throw new AppError('Company account already exists.');
    }

    const account = accountRepository.create({
      company_id,
      balance: 0,
    });

    await accountRepository.save(account);

    return account;
  }
}

export default CreateCompanyService;
