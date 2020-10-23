import { inject, injectable } from 'tsyringe';

import ICreditCardsRepository from '../repositories/ICreditCardsRepository';
import CreditCard from '../infra/typeorm/entities/CreditCard';

@injectable()
class GetBalanceService {
  constructor(
    @inject('CreditCardsRepository')
    private creditCardsRepository: ICreditCardsRepository,
  ) {}

  public async execute(
    company_id: string,
    card_number: number,
  ): Promise<CreditCard> {
    const creditCardLimits = await this.creditCardsRepository.getCurrentLimitAndTotalLimit(
      {
        company_id,
        card_number,
      },
    );

    return creditCardLimits;
  }
}

export default GetBalanceService;
