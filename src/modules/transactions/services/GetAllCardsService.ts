import { injectable, inject } from 'tsyringe';

import CreditCard from '../infra/typeorm/entities/CreditCard';

import ICreditCardsRepository from '../repositories/ICreditCardsRepository';

@injectable()
class GetAllTransactionsService {
  constructor(
    @inject('CreditCardsRepository')
    private creditCardsRepository: ICreditCardsRepository,
  ) {}

  public async execute(company_id: string): Promise<CreditCard[] | undefined> {
    const creditCards = await this.creditCardsRepository.findCardsByCompanyId(
      company_id,
    );

    return creditCards;
  }
}

export default GetAllTransactionsService;
