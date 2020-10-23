/* eslint-disable no-case-declarations */
import { getRepository, Repository } from 'typeorm';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';

import AppError from '@shared/errors/AppError';

import Transaction from '../entities/Transaction';
import CreditCard from '../entities/CreditCard';
import Account from '../entities/Account';

class TransactionRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  private accountRepository: Repository<Account>;

  private creditCardRepository: Repository<CreditCard>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
    this.accountRepository = getRepository(Account);
    this.creditCardRepository = getRepository(CreditCard);
  }

  public async findTransactionBySameCard(
    company_id: string,
    card_number: number,
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

  public async calculateBalanceOrLimitBasedOnLastTransaction(
    lastTransaction: Transaction,
    company_id: string,
    card_number: number,
  ): Promise<void> {
    const account = await this.accountRepository.findOne({
      where: { company_id },
    });

    if (!account) {
      throw new AppError('There is no account for this company_id');
    }

    const creditCard = await this.creditCardRepository.findOne({
      where: { company_id, card_number },
    });

    switch (lastTransaction.transaction_type) {
      case 'Income':
        const newBalanceIncome =
          Number(account.balance) + Number(lastTransaction.total_value);
        account.balance = newBalanceIncome;
        await this.accountRepository.save(account);
        break;
      case 'Debit':
        if (account.balance < lastTransaction.total_value) {
          throw new AppError(
            'You do not have enough balance to make this transaction.',
          );
        }
        const newBalanceDebit =
          Number(account.balance) - Number(lastTransaction.total_value);
        account.balance = newBalanceDebit;
        await this.accountRepository.save(account);
        break;
      case 'Credit':
        if (!creditCard) {
          throw new AppError(
            'You do not have a credit card to make this transaction.',
          );
        }
        if (
          Number(creditCard.current_limit) < Number(lastTransaction.total_value)
        ) {
          throw new AppError(
            'You do not have enough limit to make this transaction.',
          );
        }
        const newBalanceCredit =
          Number(creditCard.current_limit) -
          Number(lastTransaction.total_value);
        creditCard.current_limit = newBalanceCredit;
        await this.creditCardRepository.save(creditCard);
        break;
      default:
        break;
    }
  }
}

export default TransactionRepository;
