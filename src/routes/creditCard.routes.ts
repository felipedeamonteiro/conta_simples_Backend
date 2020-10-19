import { Router } from 'express';

import CreateCreditCardService from '../services/CreditCard/CreateCreditCardService';

import ensureAuthenticated from '../middleware/ensureAuthenticated';

const creditCardRouter = Router();

creditCardRouter.use(ensureAuthenticated);

creditCardRouter.post('/', async (request, response) => {
  try {
    const { company_id, total_limit } = request.body;

    const createCompany = new CreateCreditCardService();

    const creditCard = await createCompany.execute({
      company_id,
      total_limit,
    });

    return response.json(creditCard);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default creditCardRouter;
