import { inject, injectable } from 'tsyringe';

import IAccountsRepository from '../repositories/IAccountsRepository';

@injectable()
class GetBalanceService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) {}

  public async execute(company_id: string): Promise<number> {
    const balance = await this.accountsRepository.getBalance(company_id);

    return balance;
  }
}

export default GetBalanceService;
