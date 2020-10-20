import { Router } from 'express';

import GetBalanceService from '../services/AccountServices/GetBalanceService';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const accountRouter = Router();

accountRouter.use(ensureAuthenticated);

accountRouter.get('/', async (request, response) => {
  try {
    const company_id = request.company.id;

    const getBalance = new GetBalanceService();

    const balance = await getBalance.execute(company_id);

    return response.json(balance);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default accountRouter;
