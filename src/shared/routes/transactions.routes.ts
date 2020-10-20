/* eslint-disable no-case-declarations */
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import CreateTransactionService from '../services/Transaction/CreateTransactionService';

import ensureAuthenticated from '../middleware/ensureAuthenticated';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

const transactionsRouter = Router();

transactionsRouter.use(ensureAuthenticated);

transactionsRouter.post('/', async (request, response) => {
  const company_id = request.company.id;
  const {
    title,
    description,
    card_number,
    currency,
    transaction_type,
    date,
    total_value,
    instalments,
  } = request.body;

  const createTransaction = new CreateTransactionService();

  const creditCard = await createTransaction.execute({
    company_id,
    title,
    description,
    card_number,
    currency,
    transaction_type,
    date,
    total_value,
    instalments,
  });

  return response.json(creditCard);
});

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const company_id = request.company.id;
  const { transactionType } = request.body;

  const findTransactionsByType = async (): Promise<
    Transaction[] | undefined
  > => {
    switch (transactionType) {
      case 'Debit':
        const debitTransactions = await transactionRepository.find({
          where: { company_id, transaction_type: 'Debit' },
        });
        if (!debitTransactions) {
          return undefined;
        }
        return debitTransactions;
      case 'Credit':
        const creditTransactions = await transactionRepository.find({
          where: { company_id, transaction_type: 'Credit' },
        });
        if (!creditTransactions) {
          return undefined;
        }
        return creditTransactions;
      case 'Income':
        const incomeTransactions = await transactionRepository.find({
          where: { company_id, transaction_type: 'Income' },
        });
        if (!incomeTransactions) {
          return undefined;
        }
        return incomeTransactions;
      case 'Cards':
        const cardsTransactions = await transactionRepository.find({
          where: { company_id, transaction_type: 'Credit' || 'Debit' },
        });
        if (!cardsTransactions) {
          return undefined;
        }
        return cardsTransactions;
      default:
        return undefined;
    }
  };
  const transaction = await findTransactionsByType();

  return response.json(transaction);
});

export default transactionsRouter;
