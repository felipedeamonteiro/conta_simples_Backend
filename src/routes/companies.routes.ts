import { Router } from 'express';

import CreateCompanyService from '../services/CompanyServices/CreateCompanyService';

interface ICompanyHere {
  name: string;
  email: string;
  password?: string;
  company_type: 'MEI' | 'ME' | 'Startup';
}

const companiesRoutes = Router();

companiesRoutes.post('/', async (request, response) => {
  try {
    const { name, email, password, company_type } = request.body;

    const createCompany = new CreateCompanyService();

    const company: ICompanyHere = await createCompany.execute({
      name,
      email,
      password,
      company_type,
    });

    delete company.password;

    return response.json(company);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default companiesRoutes;
