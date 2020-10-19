import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateCreditCardService from '../services/CreditCard/CreateCreditCardService';

import ensureAuthenticated from '../middleware/ensureAuthenticated';
import CreditCard from '../models/CreditCard';

const creditCardRouter = Router();

creditCardRouter.use(ensureAuthenticated);

creditCardRouter.post('/', async (request, response) => {
  try {
    const { company_id, total_limit } = request.body;

    const createCard = new CreateCreditCardService();

    const creditCard = await createCard.execute({
      company_id,
      total_limit,
    });

    return response.json(creditCard);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

creditCardRouter.get('/', async (request, response) => {
  const creditCardRepository = getRepository(CreditCard);
  const company_id = request.company.id;

  const creditCards = await creditCardRepository.find({
    where: { company_id },
  });

  return response.json(creditCards);
});

export default creditCardRouter;