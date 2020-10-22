import { getRepository, Repository } from 'typeorm';

import ICompanyRepository from '@modules/companies/repositories/ICompaniesRepository';
import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompanyDTO';

import Company from '../entities/Company';

class CompanyRepository implements ICompanyRepository {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async findById(id: string): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne(id);

    return company;
  }

  public async findByEmail(email: string): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne({
      where: { email },
    });

    return company;
  }

  public async createCompany(companyData: ICreateCompanyDTO): Promise<Company> {
    const company = this.ormRepository.create(companyData);

    await this.ormRepository.save(company);

    return company;
  }

  public async saveCompany(company: Company): Promise<Company> {
    return this.ormRepository.save(company);
  }
}

export default CompanyRepository;
