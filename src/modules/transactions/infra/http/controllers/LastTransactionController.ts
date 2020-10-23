import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetLastTransactionService from '@modules/transactions/services/GetLastTransactionService';

export default class TransactionController {
  public async index(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;

    const getTransactions = container.resolve(GetLastTransactionService);

    const transaction = await getTransactions.execute(company_id);

    return response.json(classToClass(transaction));
  }
}
