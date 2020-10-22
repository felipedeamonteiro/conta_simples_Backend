import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ShowProfileService from '@modules/companies/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const company_id = request.company.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ company_id });

    return response.json(classToClass(user));
  }
}
