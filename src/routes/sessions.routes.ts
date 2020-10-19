import { Router } from 'express';

import AuthenticateUserService from '../services/CompanyToken/AuthenticateCompanyService';

interface ICompanyHere {
  email: string;
  password?: string;
}

const sessionsRoutes = Router();

sessionsRoutes.post('/', async (request, response) => {
  try {
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
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default sessionsRoutes;
