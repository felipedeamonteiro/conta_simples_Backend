import { Router } from 'express';

import ensureAuthenticated from '@modules/companies/infra/http/middleware/ensureAuthenticated';
import BalanceController from '../controllers/BalanceController';

const accountRouter = Router();
const balanceController = new BalanceController();

accountRouter.use(ensureAuthenticated);

accountRouter.get('/', balanceController.index);

export default accountRouter;
