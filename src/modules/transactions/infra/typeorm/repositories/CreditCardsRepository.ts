import { getRepository, Repository } from 'typeorm';

import ICreditCardsRepository from '@modules/transactions/repositories/ICreditCardsRepository';
import ICreateCreditCardDTO from '@modules/transactions/dtos/ICreateCreditCardDTO';

import IGetCreditCardLimitsDTO from '@modules/transactions/dtos/IGetCreditCardLimitsDTO';
import AppError from '@shared/errors/AppError';
import CreditCard from '../entities/CreditCard';

class CreditCardsRepository implements ICreditCardsRepository {
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

  public async getCurrentLimitAndTotalLimit({
    company_id,
    credit_card_number,
  }: IGetCreditCardLimitsDTO): Promise<CreditCard> {
    const creditCard = await this.ormRepository.findOne({
      where: { company_id, credit_card_number },
    });

    if (!creditCard) {
      throw new AppError('There is no such card.');
    }

    return creditCard;
  }

  public async findCardsByCompanyId(
    company_id: string,
  ): Promise<CreditCard[] | undefined> {
    const creditCards = await this.ormRepository.find({
      where: { company_id },
    });

    return creditCards;
  }

  public async findCardByCompanyIdAndByCardNumber(
    company_id: string,
    card_number: number,
  ): Promise<CreditCard | undefined> {
    const creditCards = await this.ormRepository.findOne({
      where: { company_id, card_number },
    });

    return creditCards;
  }
}

export default CreditCardsRepository;
