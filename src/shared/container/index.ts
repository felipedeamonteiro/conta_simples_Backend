import { container } from 'tsyringe';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import TransactionsRepository from '@modules/transactions/infra/typeorm/repositories/TransactionsRepository';

import ICreditCardsRepository from '@modules/transactions/repositories/ICreditCardsRepository';
import CreditCardsRepository from '@modules/transactions/infra/typeorm/repositories/CreditCardsRepository';

import IAccountsRepository from '@modules/transactions/repositories/IAccountsRepository';
import AccountsRepository from '@modules/transactions/infra/typeorm/repositories/AccountsRepository';

import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository';

import ICompanyTokensRepository from '@modules/companies/repositories/ICompanyTokensRepository';
import CompanyTokensRepository from '@modules/companies/infra/typeorm/repositories/CompanyTokensRepository';

container.registerSingleton<ITransactionsRepository>(
  'TransactionsRepository',
  TransactionsRepository,
);

container.registerSingleton<ICreditCardsRepository>(
  'CreditCardsRepository',
  CreditCardsRepository,
);

container.registerSingleton<IAccountsRepository>(
  'AccountsRepository',
  AccountsRepository,
);

container.registerSingleton<ICompaniesRepository>(
  'CompaniesRepository',
  CompaniesRepository,
);

container.registerSingleton<ICompanyTokensRepository>(
  'CompanyTokensRepository',
  CompanyTokensRepository,
);
