import { uuid } from 'uuidv4';

import ICompanyRepository from '@modules/companies/repositories/ICompaniesRepository';
import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompanyDTO';

import Company from '../../infra/typeorm/entities/Company';

class FakeCompanyRepository implements ICompanyRepository {
  private companies: Company[] = [];

  public async findById(id: string): Promise<Company | undefined> {
    const findCompany = this.companies.find(company => company.id === id);

    return findCompany;
  }

  public async findByEmail(email: string): Promise<Company | undefined> {
    const findCompany = this.companies.find(company => company.email === email);

    return findCompany;
  }

  public async createCompany(companyData: ICreateCompanyDTO): Promise<Company> {
    const company = new Company();

    Object.assign(company, { id: uuid() }, companyData);

    this.companies.push(company);

    return company;
  }

  public async saveCompany(company: Company): Promise<Company> {
    const findIndex = this.companies.findIndex(
      findCompany => findCompany.id === company.id,
    );

    this.companies[findIndex] = company;

    return company;
  }
}

export default FakeCompanyRepository;
