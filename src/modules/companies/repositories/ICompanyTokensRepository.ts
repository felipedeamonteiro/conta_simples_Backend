import CompanyToken from '../infra/typeorm/entities/CompanyToken';

export default interface ICompanyTokensRepository {
  generate(company_id: string): Promise<CompanyToken>;
  findByToken(token: string): Promise<CompanyToken | undefined>;
}
