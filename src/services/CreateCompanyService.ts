import 'reflect-metadata';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import Company from '../models/Company';

interface IRequest {
  name: string;
  email: string;
  password: string;
  company_type: string;
}

class CreateCompanyService {
  public async execute({
    name,
    email,
    password,
    company_type,
  }: IRequest): Promise<Company> {
    const companyRepository = getRepository(Company);

    const checkCompanyExists = await getRepository(Company).findOne({
      where: { email },
    });

    if (checkCompanyExists) {
      throw new Error('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const company = companyRepository.create({
      name,
      email,
      password: hashedPassword,
      company_type,
    });

    await companyRepository.save(company);

    return company;
  }
}

export default CreateCompanyService;
