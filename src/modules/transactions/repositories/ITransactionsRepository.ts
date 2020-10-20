import Transaction from '../infra/typeorm/entities/Transaction';
import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO';

export default interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  findTransactionBySameCard(
    card_number: string,
  ): Promise<Transaction[] | undefined>;
}
