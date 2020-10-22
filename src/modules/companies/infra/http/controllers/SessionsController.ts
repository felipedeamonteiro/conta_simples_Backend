import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateCompanyService from '@modules/companies/services/AuthenticateCompanyService';

interface ICompanyHere {
  email: string;
  password?: string;
}

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateCompany = container.resolve(AuthenticateCompanyService);

    const { company, token } = await authenticateCompany.execute({
      email,
      password,
    });

    // This was done because an error in the delete method when not passing "?" in type of the deleted data
    const companyData: ICompanyHere = company;

    delete companyData.password;

    return response.json({ company: classToClass(company), token });
  }
}
