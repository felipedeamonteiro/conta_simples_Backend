import Account from '../infra/typeorm/entities/Account';
import ICreateAccountDTO from '../dtos/ICreateAccountDTO';

export default interface IAccountsRepository {
  create(data: ICreateAccountDTO): Promise<Account>;
  findTransactionBySameCard(
    card_number: string,
  ): Promise<Account[] | undefined>;
}
