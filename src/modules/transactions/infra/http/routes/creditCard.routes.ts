import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/companies/infra/http/middleware/ensureAuthenticated';

import CreditCardsController from '../controllers/CreditCardsController';

const creditCardRouter = Router();
const creditCardController = new CreditCardsController();

creditCardRouter.use(ensureAuthenticated);

creditCardRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      total_limit: Joi.number().required(),
    },
  }),
  creditCardController.create,
);

export default creditCardRouter;
