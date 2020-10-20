import { Router } from 'express';

import companiesRouter from './companies.routes';
import sessionsRouter from './sessions.routes';
import creditCardRouter from './creditCard.routes';
import transactionsRouter from './transactions.routes';
import accountRouter from './account.routes';

const routes = Router();

routes.use('/companies', companiesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/cards', creditCardRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/accounts', accountRouter);

export default routes;
