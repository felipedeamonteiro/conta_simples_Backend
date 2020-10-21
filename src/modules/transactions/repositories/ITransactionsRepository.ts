import Transaction from '../infra/typeorm/entities/Transaction';
import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO';

export default interface ITransactionsRepository {
  findTransactionBySameCard(
    card_number: string,
  ): Promise<Transaction[] | undefined>;
  // Filtrar por data e por flags de crédito e débito
  getAllAccountTransactions(
    company_id: string,
  ): Promise<Transaction[] | undefined>;
  getLastAccountTransaction(
    company_id: string,
    date: Date,
  ): Promise<Transaction | undefined>;
  create(data: ICreateTransactionDTO): Promise<Transaction>;
}
