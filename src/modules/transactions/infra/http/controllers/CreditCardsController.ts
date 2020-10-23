import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateCreditCardService from '@modules/transactions/services/CreateCreditCardService';

export default class CreditCardController {
  public async create(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;
    const { total_limit } = request.body;

    const createCreditCard = container.resolve(CreateCreditCardService);

    const creditCard = await createCreditCard.execute({
      company_id,
      total_limit,
    });

    return response.json(classToClass(creditCard));
  }
}
