import Company from '../infra/typeorm/entities/Company';
import ICreateCompanyDTO from '../dtos/ICreateCompanyDTO';

export default interface ICompanyRepository {
  findById(id: string): Promise<Company | undefined>;
  findByEmail(email: string): Promise<Company | undefined>;
  createCompany(data: ICreateCompanyDTO): Promise<Company>;
  saveCompany(company: Company): Promise<Company>;
}
