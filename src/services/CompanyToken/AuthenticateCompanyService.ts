import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../../config/auth';

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

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: company.id,
      expiresIn,
    });

    return {
      company,
      token,
    };
  }
}

export default AuthenticateCompanyService;
