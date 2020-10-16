import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateCompanyService';

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authenticateCompany = new AuthenticateUserService();

    const { company, token } = await authenticateCompany.execute({
      email,
      password,
    });

    delete company.password;

    return response.json({ company, token });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default sessionsRoutes;
