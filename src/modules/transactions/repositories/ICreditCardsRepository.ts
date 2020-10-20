import CreditCard from '../infra/typeorm/entities/CreditCard';
import ICreateCreditCardDTO from '../dtos/ICreateCreditCardDTO';

export default interface ICreditCardsRepository {
  create(data: ICreateCreditCardDTO): Promise<CreditCard>;
}
