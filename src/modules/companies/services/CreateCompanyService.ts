import { injectable, inject } from 'tsyringe';

import Company from '@modules/companies/infra/typeorm/entities/Company';
import AppError from '@shared/errors/AppError';
import IAccountsRepository from '@modules/transactions/repositories/IAccountsRepository';
import ICompaniesRepository from '../repositories/ICompaniesRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
  company_type: 'MEI' | 'ME' | 'Startup';
}

@injectable()
class CreateCompanyService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) {}

  public async execute({
    name,
    email,
    password,
    company_type,
  }: IRequest): Promise<Company> {
    const checkCompanyExists = await this.companiesRepository.findByEmail(
      email,
    );

    if (checkCompanyExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const company = await this.companiesRepository.createCompany({
      name,
      email,
      password: hashedPassword,
      company_type,
    });

    await this.accountsRepository.createAccount({
      company_id: company.id,
    });

    return company;
  }
}

export default CreateCompanyService;
