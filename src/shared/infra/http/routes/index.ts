import { Router } from 'express';

import companiesRouter from '@modules/companies/infra/http/routes/companies.routes';
import sessionsRouter from '@modules/companies/infra/http/routes/sessions.routes';
import creditCardRouter from '@modules/transactions/infra/http/routes/creditCard.routes';
import transactionsRouter from '@modules/transactions/infra/http/routes/transactions.routes';
import accountRouter from '@modules/transactions/infra/http/routes/account.routes';

const routes = Router();

routes.use('/companies', companiesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/cards', creditCardRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/accounts', accountRouter);

export default routes;
