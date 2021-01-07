import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Company from '../infra/typeorm/entities/Company';
import ICompaniesRepository from '../repositories/ICompaniesRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  company: Company;
  token: string;
}

@injectable()
class AuthenticateCompanyService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const company = await this.companiesRepository.findByEmail(email);

    if (!company) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // company.password - Senha criptografada
    // password - Senha não criptografada

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      company.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    if (!secret) {
      throw new AppError('secretOrPrivateKey must have a value', 401);
    }

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
