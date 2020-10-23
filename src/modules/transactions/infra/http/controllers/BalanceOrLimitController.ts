import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CalculateBalanceOrLimitService from '@modules/transactions/services/CalculateBalanceOrLimitService';

export default class BallanceController {
  public async index(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;
    const { card_number } = request.body;

    const balanceOrLimit = container.resolve(CalculateBalanceOrLimitService);

    await balanceOrLimit.execute({ company_id, card_number });

    return response.json(classToClass(balanceOrLimit));
  }
}
