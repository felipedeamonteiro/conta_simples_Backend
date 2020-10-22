import Transaction from '../infra/typeorm/entities/Transaction';
import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO';

export default interface ITransactionsRepository {
  findTransactionBySameCard(
    company_id: string,
    credit_card_number: number,
  ): Promise<Transaction[] | undefined>;
  // Filtrar por data e por flags de crédito e débito
  getAllAccountTransactions(
    company_id: string,
  ): Promise<Transaction[] | undefined>;
  getLastAccountTransaction(
    company_id: string,
  ): Promise<Transaction | undefined>;
  createTransaction(data: ICreateTransactionDTO): Promise<Transaction>;
  calculateBalanceOrLimitBasedOnLastTransaction(
    lastTransaction: Transaction,
    company_id: string,
    credit_card_number: number | undefined,
  ): Promise<void>;
}
