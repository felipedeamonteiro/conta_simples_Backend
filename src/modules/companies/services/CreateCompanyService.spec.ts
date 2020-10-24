import AppError from '@shared/errors/AppError';

import FakeAccountRepository from '@modules/transactions/repositories/fakes/FakeAccountsRepository';
import FakeCompaniesRepository from '../repositories/fakes/FakeCompaniesRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateCompanyService from './CreateCompanyService';

let fakeCompaniesRepository: FakeCompaniesRepository;
let fakeHashProvider: FakeHashProvider;
let fakeAccountRepository: FakeAccountRepository;
let createCompany: CreateCompanyService;

describe('CreateCompany', () => {
  beforeEach(() => {
    fakeCompaniesRepository = new FakeCompaniesRepository();
    fakeAccountRepository = new FakeAccountRepository();
    fakeHashProvider = new FakeHashProvider();
    createCompany = new CreateCompanyService(
      fakeCompaniesRepository,
      fakeHashProvider,
      fakeAccountRepository,
    );
  });

  it('should be able to create a new company', async () => {
    const company = await createCompany.execute({
      name: 'John Doe SA',
      email: 'johndoe.sa@mail.com',
      password: '123456',
      company_type: 'MEI',
    });

    expect(company).toHaveProperty('id');
    expect(company.email).toBe('johndoe.sa@mail.com');
  });

  it('should not be able to create a new company with same email from another', async () => {
    await createCompany.execute({
      name: 'John Doe SA',
      email: 'johndoe.sa@mail.com',
      password: '123456',
      company_type: 'ME',
    });

    await expect(
      createCompany.execute({
        name: 'John Doe SA',
        email: 'johndoe.sa@mail.com',
        password: '123456',
        company_type: 'ME',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
