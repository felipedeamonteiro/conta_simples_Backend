import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import Company from '../models/Company';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  company: Company;
}

class AuthenticateCompanyService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const companyRepository = getRepository(Company);

    const company = await companyRepository.findOne({ where: { email } });

    if (!company) {
      throw new Error('Incorrect email/password combination');
    }

    const passwordMatched = await compare(password, company.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination');
    }

    return {
      company,
    };
  }
}

export default AuthenticateCompanyService;
