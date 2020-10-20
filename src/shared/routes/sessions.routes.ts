import { Router } from 'express';

import AuthenticateUserService from '../services/CompanyToken/AuthenticateCompanyService';

interface ICompanyHere {
  email: string;
  password?: string;
}

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateCompany = new AuthenticateUserService();

  const { company, token } = await authenticateCompany.execute({
    email,
    password,
  });

  // This was done because an error in the delete method when not passing "?" in type of the deleted data
  const companyData: ICompanyHere = company;

  delete companyData.password;

  return response.json({ companyData, token });
});

export default sessionsRouter;
