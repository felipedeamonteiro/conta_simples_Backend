import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetAllCardsService from '@modules/transactions/services/GetAllCardsService';

export default class AllCardsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;

    const getCards = container.resolve(GetAllCardsService);

    const cards = await getCards.execute(company_id);

    return response.json(cards);
  }
}
