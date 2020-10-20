import { Router } from 'express';

import CreateCompanyService from '../../../services/CreateCompanyService';

interface ICompanyHere {
  name: string;
  email: string;
  password?: string;
  company_type: 'MEI' | 'ME' | 'Startup';
}

const companiesRoutes = Router();

companiesRoutes.post('/', async (request, response) => {
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
});

export default companiesRoutes;
