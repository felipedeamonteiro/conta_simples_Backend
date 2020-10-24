import AppError from '@shared/errors/AppError';

import FakeCompaniesRepository from '../repositories/fakes/FakeCompaniesRepository';
import ShowProfileService from './ShowProfileService';

let fakeCompaniesRepository: FakeCompaniesRepository;
let showProfile: ShowProfileService;

describe('ProfileService', () => {
  beforeEach(() => {
    fakeCompaniesRepository = new FakeCompaniesRepository();
    showProfile = new ShowProfileService(fakeCompaniesRepository);
  });

  it('should be able to show the profile', async () => {
    const company = await fakeCompaniesRepository.createCompany({
      name: 'John Doe SA',
      email: 'johndoe.sa@mail.com',
      password: '123456',
      company_type: 'Startup',
    });

    const profile = await showProfile.execute({
      company_id: company.id,
    });

    expect(profile.name).toBe('John Doe SA');
    expect(profile.email).toBe('johndoe.sa@mail.com');
  });

  it('should not be able to show the profile from non-existing company', async () => {
    await expect(
      showProfile.execute({
        company_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
