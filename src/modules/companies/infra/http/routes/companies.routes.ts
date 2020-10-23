import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import CompaniesController from '../controllers/CompaniesController';

const companiesRoutes = Router();
const companiesController = new CompaniesController();

companiesRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      company_type: Joi.string().required(),
    },
  }),
  companiesController.create,
);

export default companiesRoutes;
