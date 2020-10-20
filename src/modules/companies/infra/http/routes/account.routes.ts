import { Router } from 'express';

import ensureAuthenticated from '../middleware/ensureAuthenticated';
import GetBalanceService from '../../../services/GetBalanceService';

const accountRouter = Router();

accountRouter.use(ensureAuthenticated);

accountRouter.get('/', async (request, response) => {
  const company_id = request.company.id;

  const getBalance = new GetBalanceService();

  const balance = await getBalance.execute(company_id);

  return response.json(balance);
});

export default accountRouter;
