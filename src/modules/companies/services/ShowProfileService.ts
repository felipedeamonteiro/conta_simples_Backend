/* eslint-disable camelcase */
import { injectable, inject } from 'tsyringe';

import Company from '@modules/companies/infra/typeorm/entities/Company';
import AppError from '@shared/errors/AppError';
import ICompaniesRepository from '../repositories/ICompaniesRepository';

interface IRequest {
  company_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute({ company_id }: IRequest): Promise<Company> {
    const company = await this.companiesRepository.findById(company_id);

    if (!company) {
      throw new AppError('Company not found.');
    }

    return company;
  }
}

export default ShowProfileService;
