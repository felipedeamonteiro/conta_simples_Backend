import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateTransactionService from '@modules/transactions/services/CreateTransactionService';

export default class TransactionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;
    const {
      title,
      description,
      credit_card_number,
      currency,
      transaction_type,
      date,
      total_value,
      instalments,
    } = request.body;

    const createTransaction = container.resolve(CreateTransactionService);

    const transaction = await createTransaction.execute({
      company_id,
      title,
      description,
      credit_card_number,
      currency,
      transaction_type,
      date,
      total_value,
      instalments,
    });

    return response.json(classToClass(transaction));
  }
}
