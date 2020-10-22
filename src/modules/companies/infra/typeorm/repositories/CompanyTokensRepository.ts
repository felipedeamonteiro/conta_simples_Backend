import { getRepository, Repository } from 'typeorm';

import ICompanyTokensRepository from '@modules/companies/repositories/ICompanyTokensRepository';

import CompanyToken from '../entities/CompanyToken';

class CompanyTokenRepository implements ICompanyTokensRepository {
  private ormRepository: Repository<CompanyToken>;

  constructor() {
    this.ormRepository = getRepository(CompanyToken);
  }

  public async generate(company_id: string): Promise<CompanyToken> {
    const companyToken = this.ormRepository.create({ company_id });

    await this.ormRepository.save(companyToken);

    return companyToken;
  }

  public async findByToken(token: string): Promise<CompanyToken | undefined> {
    const companyToken = await this.ormRepository.findOne({ where: { token } });

    return companyToken;
  }
}

export default CompanyTokenRepository;
