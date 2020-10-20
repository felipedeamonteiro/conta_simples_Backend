import 'reflect-metadata';
import { getCustomRepository, getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import Company from '@modules/company/infra/typeorm/entities/Company';
import AppError from '@shared/errors/AppError';
import AccountsRepository from '../repositories/AccountsRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
  company_type: 'MEI' | 'ME' | 'Startup';
}

class CreateCompanyService {
  public async execute({
    name,
    email,
    password,
    company_type,
  }: IRequest): Promise<Company> {
    const companyRepository = getRepository(Company);
    const accountRepository = getCustomRepository(AccountsRepository);

    const checkCompanyExists = await companyRepository.findOne({
      where: { email },
    });

    if (checkCompanyExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const company = companyRepository.create({
      name,
      email,
      password: hashedPassword,
      company_type,
    });

    await companyRepository.save(company);

    const { id } = company;

    const account = accountRepository.create({
      company_id: id,
      balance: 0,
    });

    await accountRepository.save(account);

    return company;
  }
}

export default CreateCompanyService;
