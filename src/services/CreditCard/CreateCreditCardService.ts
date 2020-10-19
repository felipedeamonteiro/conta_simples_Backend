import 'reflect-metadata';
import { getRepository } from 'typeorm';

import CreditCard from '../../models/CreditCard';

interface IRequest {
  company_id: string;
  total_limit: number;
}

class CreateCompanyService {
  public async execute({
    company_id,
    total_limit,
  }: IRequest): Promise<CreditCard> {
    const creditCardRepository = getRepository(CreditCard);

    const [, checkCardsQuantity] = await creditCardRepository.findAndCount({
      where: { company_id },
    });

    const creditCard = creditCardRepository.create({
      company_id,
      total_limit,
      current_limit: total_limit,
      credit_card_number: checkCardsQuantity + 1,
    });

    await creditCardRepository.save(creditCard);

    return creditCard;
  }
}

export default CreateCompanyService;
