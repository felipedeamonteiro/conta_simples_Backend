import { Router } from 'express';

import companiesRouter from './companies.routes';
import sessionsRoutes from './sessions.routes';
import creditCardRouter from './creditCard.routes';

const routes = Router();

routes.use('/companies', companiesRouter);
routes.use('/sessions', sessionsRoutes);
routes.use('/cards', creditCardRouter);

export default routes;
