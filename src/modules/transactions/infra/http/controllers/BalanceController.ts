import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetBalanceService from '@modules/transactions/services/GetBalanceService';

export default class BallanceController {
  public async index(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;

    const getBalance = container.resolve(GetBalanceService);

    const balance = await getBalance.execute(company_id);

    return response.json(balance);
  }
}
