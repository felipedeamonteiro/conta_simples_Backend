import { Router } from 'express';

import companiesRouter from '@modules/company/infra/http/routes/companies.routes';
import sessionsRouter from '@modules/company/infra/http/routes/sessions.routes';
import creditCardRouter from '@modules/transaction/infra/http/routes/creditCard.routes';
import transactionsRouter from '@modules/transaction/infra/http/routes/transactions.routes';
import accountRouter from '@modules/company/infra/http/routes/account.routes';

const routes = Router();

routes.use('/companies', companiesRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/cards', creditCardRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/accounts', accountRouter);

export default routes;
