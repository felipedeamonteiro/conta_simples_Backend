import CreditCard from '../infra/typeorm/entities/CreditCard';
import ICreateCreditCardDTO from '../dtos/ICreateCreditCardDTO';
import IGetCreditCardLimitsDTO from '../dtos/IGetCreditCardLimitsDTO';

export default interface ICreditCardsRepository {
  create(data: ICreateCreditCardDTO): Promise<CreditCard>;
  getCurrentLimitAndTotalLimit({
    company_id,
    card_number,
  }: IGetCreditCardLimitsDTO): Promise<CreditCard>;
  findCardsByCompanyId(company_id: string): Promise<CreditCard[] | undefined>;
  findCardByCompanyIdAndByCardNumber(
    company_id: string,
    card_number: number,
  ): Promise<CreditCard | undefined>;
  findCardsAndCount(company_id: string): Promise<number>;
}
