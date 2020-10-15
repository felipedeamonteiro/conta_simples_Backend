import { Router } from 'express';

import companiesRouter from './companies.routes';
import sessionsRoutes from './sessions.routes';

const routes = Router();

routes.use('/companies', companiesRouter);
routes.use('/sessions', sessionsRoutes);

export default routes;
