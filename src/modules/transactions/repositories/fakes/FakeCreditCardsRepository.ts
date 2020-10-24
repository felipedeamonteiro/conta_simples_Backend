import { uuid } from 'uuidv4';

import ICreditCardsRepository from '@modules/transactions/repositories/ICreditCardsRepository';
import ICreateCreditCardDTO from '@modules/transactions/dtos/ICreateCreditCardDTO';

import IGetCreditCardLimitsDTO from '@modules/transactions/dtos/IGetCreditCardLimitsDTO';
import AppError from '@shared/errors/AppError';
import CreditCard from '../../infra/typeorm/entities/CreditCard';

class FakeCreditCardsRepository implements ICreditCardsRepository {
  private creditCards: CreditCard[] = [];

  public async create({
    company_id,
    total_limit,
    card_number,
    current_limit,
  }: ICreateCreditCardDTO): Promise<CreditCard> {
    const creditCard = new CreditCard();

    Object.assign(creditCard, {
      id: uuid(),
      company_id,
      total_limit,
      card_number,
      current_limit,
    });

    return creditCard;
  }

  public async getCurrentLimitAndTotalLimit({
    company_id,
    card_number,
  }: IGetCreditCardLimitsDTO): Promise<CreditCard> {
    const creditCard = this.creditCards.find(
      card =>
        card.company_id === company_id && card.card_number === card_number,
    );

    if (!creditCard) {
      throw new AppError('There is no such card.');
    }

    return creditCard;
  }

  public async findCardsByCompanyId(
    company_id: string,
  ): Promise<CreditCard[] | undefined> {
    const creditCard = this.creditCards.filter(
      card => card.company_id === company_id,
    );

    if (!creditCard) {
      throw new AppError('There is no such card.');
    }

    return creditCard;
  }

  public async findCardByCompanyIdAndByCardNumber(
    company_id: string,
    card_number: number,
  ): Promise<CreditCard | undefined> {
    const creditCard = this.creditCards.find(
      card =>
        card.company_id === company_id && card.card_number === card_number,
    );

    return creditCard;
  }

  public async findCardsAndCount(company_id: string): Promise<number> {
    const creditCard = this.creditCards.filter(
      card => card.company_id === company_id,
    );

    const cardsQuantity = creditCard.length;

    return cardsQuantity;
  }
}

export default FakeCreditCardsRepository;
