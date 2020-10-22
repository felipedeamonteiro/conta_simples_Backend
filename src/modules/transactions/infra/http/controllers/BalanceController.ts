import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import GetBalanceService from '@modules/transactions/services/GetBalanceService';

export default class BallanceController {
  public async index(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;

    const getBalance = container.resolve(GetBalanceService);

    await getBalance.execute(company_id);

    return response.json(classToClass(getBalance));
  }
}
