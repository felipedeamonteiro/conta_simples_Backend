/* eslint-disable no-case-declarations */
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/companies/infra/http/middleware/ensureAuthenticated';
import TransactionsController from '../controllers/TransactionsController';
import LastTransactionController from '../controllers/LastTransactionController';

const transactionsRouter = Router();
const transactionsController = new TransactionsController();
const lastTransactionsController = new LastTransactionController();

transactionsRouter.use(ensureAuthenticated);

transactionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string(),
      card_number: Joi.number(),
      currency: Joi.string().required(),
      transaction_type: Joi.string().required(),
      date: Joi.date().required(),
      total_value: Joi.number().required(),
      instalments: Joi.number(),
    },
  }),
  transactionsController.create,
);

transactionsRouter.get('/', transactionsController.index);
transactionsRouter.get('/last', lastTransactionsController.index);

export default transactionsRouter;
