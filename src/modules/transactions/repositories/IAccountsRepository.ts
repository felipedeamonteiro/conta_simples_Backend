import Account from '../infra/typeorm/entities/Account';
import ICreateAccountDTO from '../dtos/ICreateAccountDTO';

export default interface IAccountsRepository {
  createAccount(data: ICreateAccountDTO): Promise<Account>;
  getBalance(company_id: string): Promise<number>;
}
