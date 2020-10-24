/* eslint-disable no-case-declarations */
import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';

import AppError from '@shared/errors/AppError';

import Transaction from '../../infra/typeorm/entities/Transaction';
import CreditCard from '../../infra/typeorm/entities/CreditCard';
import Account from '../../infra/typeorm/entities/Account';

class FakeTransactionRepository implements ITransactionsRepository {
  private transactions: Transaction[] = [];

  private accounts: Account[] = [];

  private creditCards: CreditCard[] = [];

  public async findTransactionBySameCard(
    company_id: string,
    card_number: number,
  ): Promise<Transaction[] | undefined> {
    const findTransactions = this.transactions.filter(
      transaction =>
        transaction.card_number === card_number &&
        transaction.company_id === company_id,
    );

    if (!findTransactions) {
      throw new AppError('There is not transactions for this card yet.');
    }

    return findTransactions;
  }

  public async getAllAccountTransactions(
    company_id: string,
  ): Promise<Transaction[] | undefined> {
    const getTransactions = this.transactions.filter(
      transaction => transaction.company_id === company_id,
    );

    if (!getTransactions) {
      throw new AppError('There is not transactions for this account yet.');
    }

    return getTransactions;
  }

  public async getLastAccountTransaction(
    company_id: string,
  ): Promise<Transaction | undefined> {
    const transactionsByCompanyId = this.transactions.filter(
      transaction => transaction.company_id === company_id,
    );

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
    const transaction = new Transaction();

    Object.assign(transaction, {
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

    return transaction;
  }

  public async calculateBalanceOrLimitBasedOnLastTransaction(
    lastTransaction: Transaction,
    company_id: string,
    card_number: number,
  ): Promise<void> {
    const account = this.accounts.find(
      accountData => accountData.company_id === company_id,
    );

    if (!account) {
      throw new AppError('There is no account for this company_id');
    }

    const creditCard = this.creditCards.find(
      creditCardData =>
        creditCardData.company_id === company_id &&
        creditCardData.card_number === card_number,
    );

    switch (lastTransaction.transaction_type) {
      case 'Income':
        const newBalanceIncome =
          Number(account.balance) + Number(lastTransaction.total_value);
        account.balance = newBalanceIncome;
        this.accounts.push(account);
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
        this.accounts.push(account);
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
        this.creditCards.push(creditCard);
        break;
      default:
        break;
    }
  }
}

export default FakeTransactionRepository;
