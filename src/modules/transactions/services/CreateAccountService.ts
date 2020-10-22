import 'reflect-metadata';
import { getCustomRepository } from 'typeorm';

import Account from '@modules/transactions/infra/typeorm/entities/Account';
import AppError from '@shared/errors/AppError';
import AccountRepository from '../infra/typeorm/repositories/AccountsRepository';

interface IRequest {
  company_id: string;
  balance: number;
}

class CreateCompanyService {
  public async execute({ company_id }: IRequest): Promise<Account> {
    const accountRepository = getCustomRepository(AccountRepository);
  }
}

export default CreateCompanyService;
