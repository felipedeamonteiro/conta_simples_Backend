import CreditCard from '../infra/typeorm/entities/CreditCard';
import ICreateCreditCardDTO from '../dtos/ICreateCreditCardDTO';
import IGetCreditCardLimitsDTO from '../dtos/IGetCreditCardLimitsDTO';

export default interface ICreditCardsRepository {
  create(data: ICreateCreditCardDTO): Promise<CreditCard>;
  getCurrentLimitAndTotalLimit(
    data: IGetCreditCardLimitsDTO,
  ): Promise<CreditCard>;
  findCardsByCompanyId(company_id: string): Promise<CreditCard[] | undefined>;
  findCardByCompanyIdAndByCardNumber(
    company_id: string,
    credit_card_number: number,
  ): Promise<CreditCard | undefined>;
}
