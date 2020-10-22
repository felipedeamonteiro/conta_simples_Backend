import { getRepository, Repository } from 'typeorm';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';

import AppError from '@shared/errors/AppError';

import Transaction from '../entities/Transaction';

class TransactionRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async findTransactionBySameCard(
    company_id: string,
    card_number: string,
  ): Promise<Transaction[] | undefined> {
    const findTransaction = await this.ormRepository.find({
      where: { card_number, company_id },
    });

    if (!findTransaction) {
      throw new AppError('There is not transactions for this card yet.');
    }

    return findTransaction;
  }

  public async getAllAccountTransactions(
    company_id: string,
  ): Promise<Transaction[] | undefined> {
    const getTransactions = await this.ormRepository.find({
      where: { company_id },
    });

    if (!getTransactions) {
      throw new AppError('There is not transactions for this account yet.');
    }

    return getTransactions;
  }

  public async getLastAccountTransaction(
    company_id: string,
  ): Promise<Transaction | undefined> {
    const transactionsByCompanyId = await this.ormRepository.find({
      where: { company_id },
    });

    if (!transactionsByCompanyId) {
      throw new AppError('There is not transactions for this account yet.');
    }

    const lastTransaction = transactionsByCompanyId.reduce(
      (previousTransaction, nextTransaction) =>
        previousTransaction.date > nextTransaction.date
          ? previousTransaction
          : nextTransaction,
    );

    return lastTransaction;
  }

  public async createTransaction({
    company_id,
    title,
    description,
    card_number,
    currency,
    transaction_type,
    date,
    total_value,
    instalments,
    instalment_value,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      company_id,
      title,
      description,
      card_number,
      currency,
      transaction_type,
      date,
      total_value,
      instalments,
      instalment_value,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }
}

export default TransactionRepository;
