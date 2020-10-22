import { injectable, inject } from 'tsyringe';
import CreditCard from '../infra/typeorm/entities/CreditCard';
import ICreditCardsRepository from '../repositories/ICreditCardsRepository';

interface IRequest {
  company_id: string;
  total_limit: number;
}

@injectable()
class CreateCreditCardService {
  constructor(
    @inject('CreditCardsRepository')
    private creditCardsRepository: ICreditCardsRepository,
  ) {}

  public async execute({
    company_id,
    total_limit,
  }: IRequest): Promise<CreditCard> {
    const cardsQuantity = await this.creditCardsRepository.findCardsAndCount(
      company_id,
    );

    const creditCard = this.creditCardsRepository.create({
      company_id,
      total_limit,
      current_limit: total_limit,
      credit_card_number: cardsQuantity + 1,
    });

    return creditCard;
  }
}

export default CreateCreditCardService;
