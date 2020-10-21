import Account from '../infra/typeorm/entities/Account';
import ICreateAccountDTO from '../dtos/ICreateAccountDTO';

export default interface IAccountsRepository {
  findTransactionBySameCard(
    card_number: string,
  ): Promise<Account[] | undefined>;
  create(data: ICreateAccountDTO): Promise<Account>;
}
