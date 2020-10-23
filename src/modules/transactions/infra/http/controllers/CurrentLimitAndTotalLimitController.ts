import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetCurrentLimitAndTotalLimitService from '@modules/transactions/services/GetCurrentLimitAndTotalLimitService';

export default class BallanceController {
  public async index(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;
    const { card_number } = request.params;
    const cardNumber = Number(card_number);

    const getCardLimits = container.resolve(
      GetCurrentLimitAndTotalLimitService,
    );

    const creditCard = await getCardLimits.execute(company_id, cardNumber);

    const { current_limit } = creditCard;
    const { total_limit } = creditCard;

    return response.json({ total_limit, current_limit });
  }
}
