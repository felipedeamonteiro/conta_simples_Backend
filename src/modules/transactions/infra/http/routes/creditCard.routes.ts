import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/companies/infra/http/middleware/ensureAuthenticated';

import CreditCardsController from '../controllers/CreditCardsController';
import AllCardsController from '../controllers/AllCardsController';
import CurrentLimitAndTotalLimitController from '../controllers/CurrentLimitAndTotalLimitController';

const creditCardRouter = Router();
const creditCardController = new CreditCardsController();
const allCardsController = new AllCardsController();
const currentLimitAndTotalLimitController = new CurrentLimitAndTotalLimitController();

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

creditCardRouter.get('/', allCardsController.index);

creditCardRouter.get(
  '/limits/:card_number',
  celebrate({
    [Segments.PARAMS]: {
      card_number: Joi.number().required(),
    },
  }),
  currentLimitAndTotalLimitController.index,
);

export default creditCardRouter;
