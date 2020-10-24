import AppError from '@shared/errors/AppError';

import FakeCompaniesRepository from '../repositories/fakes/FakeCompaniesRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateCompanyService from './AuthenticateCompanyService';

let fakeCompaniesRepository: FakeCompaniesRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateCompany: AuthenticateCompanyService;

describe('AuthenticateCompany', () => {
  beforeEach(() => {
    fakeCompaniesRepository = new FakeCompaniesRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateCompany = new AuthenticateCompanyService(
      fakeCompaniesRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const company = await fakeCompaniesRepository.createCompany({
      name: 'John Doe SA',
      email: 'johndoe.sa@mail.com',
      password: '123456',
      company_type: 'Startup',
    });

    const response = await authenticateCompany.execute({
      email: 'johndoe.sa@mail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.company).toEqual(company);
  });
  it('should not be able to authenticate with non existing user', async () => {
    expect(
      authenticateCompany.execute({
        email: 'johndoe@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate with wrong password', async () => {
    await fakeCompaniesRepository.createCompany({
      name: 'John Doe SA',
      email: 'johndoe.sa@mail.com',
      password: '123456',
      company_type: 'Startup',
    });

    await expect(
      authenticateCompany.execute({
        email: 'johndoe.sa@mail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
