/* eslint-disable no-case-declarations */
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/companies/infra/http/middleware/ensureAuthenticated';
// importar controllers

const transactionsRouter = Router();
// instanciar controllers

transactionsRouter.use(ensureAuthenticated);

transactionsRouter.post(
  '/',
  celebrate({ [Segments.BODY]: {} }),
  Controller.method,
);

transactionsRouter.get('/', Controller.method);

export default transactionsRouter;
