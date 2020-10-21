import CreditCard from '../infra/typeorm/entities/CreditCard';
import ICreateCreditCardDTO from '../dtos/ICreateCreditCardDTO';
import IGetCreditCardLimitsDTO from '../dtos/IGetCreditCardLimitsDTO';

export default interface ICreditCardsRepository {
  create(data: ICreateCreditCardDTO): Promise<CreditCard>;
  getCurrentLimitAndTotalLimit(
    data: IGetCreditCardLimitsDTO,
  ): Promise<CreditCard>;
}
