import { Router } from 'express';

import CreateCompanyService from '../services/CreateCompanyService';

const companiesRoutes = Router();

companiesRoutes.post('/', async (request, response) => {
  try {
    const { name, email, password, company_type } = request.body;

    const createCompany = new CreateCompanyService();

    const company = await createCompany.execute({
      name,
      email,
      password,
      company_type,
    });

    return response.json(company);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default companiesRoutes;
