import { Router } from 'express';

import ensureAuthenticated from '@modules/companies/infra/http/middleware/ensureAuthenticated';
import BalanceController from '../controllers/BalanceController';
import BalanceOrLimitController from '../controllers/BalanceOrLimitController';

const accountRouter = Router();
const balanceController = new BalanceController();
const balanceOrLimitController = new BalanceOrLimitController();

accountRouter.use(ensureAuthenticated);

accountRouter.get('/balance', balanceController.index);
accountRouter.get('/balance_or_limit', balanceOrLimitController.index);

export default accountRouter;
