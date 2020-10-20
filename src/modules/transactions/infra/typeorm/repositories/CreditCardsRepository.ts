import { getRepository, Repository } from 'typeorm';

import ICreditCardsRepository from '@modules/transactions/repositories/ICreditCardsRepository';
import ICreateCreditCardDTO from '@modules/transactions/dtos/ICreateCreditCardDTO';

import CreditCard from '../entities/CreditCard';

class CreditCardRepository implements ICreditCardsRepository {
  private ormRepository: Repository<CreditCard>;

  constructor() {
    this.ormRepository = getRepository(CreditCard);
  }

  public async create({
    company_id,
    total_limit,
    credit_card_number,
    current_limit,
  }: ICreateCreditCardDTO): Promise<CreditCard> {
    const creditCard = this.ormRepository.create({
      company_id,
      total_limit,
      credit_card_number,
      current_limit,
    });

    await this.ormRepository.save(creditCard);

    return creditCard;
  }
}

export default CreditCardRepository;
