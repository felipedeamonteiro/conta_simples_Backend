import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import Company from '../../models/Company';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  company: Company;
  token: string;
}

class AuthenticateCompanyService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const companyRepository = getRepository(Company);

    const company: Company | undefined = await companyRepository.findOne({
      where: { email },
    });

    if (!company) {
      throw new Error('Incorrect email/password combination');
    }

    const passwordMatched = await compare(password, company.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination');
    }

    const token = sign({}, 'e68cb4131836d90836be7222c3adbf9d', {
      subject: company.id,
      expiresIn: '1d',
    });

    return {
      company,
      token,
    };
  }
}

export default AuthenticateCompanyService;
