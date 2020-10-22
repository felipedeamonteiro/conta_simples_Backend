import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateCompanyService from '@modules/companies/services/CreateCompanyService';

interface ICompanyHere {
  name: string;
  email: string;
  password?: string;
  company_type: 'MEI' | 'ME' | 'Startup';
}

export default class CompaniesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, company_type } = request.body;

    const createCompany = container.resolve(CreateCompanyService);

    const company: ICompanyHere = await createCompany.execute({
      name,
      email,
      password,
      company_type,
    });

    delete company.password;

    return response.json(classToClass(company));
  }
}
