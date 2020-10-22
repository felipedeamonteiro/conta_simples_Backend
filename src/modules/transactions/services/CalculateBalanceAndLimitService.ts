import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import CreditCard from '@modules/transactions/infra/typeorm/entities/CreditCard';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';
import ICreditCardsRepository from '@modules/transactions/repositories/ICreditCardsRepository';
import IAccountsRepository from '../repositories/IAccountsRepository';

@injectable()
class CalculateBalanceAndLimitService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CreditCardsRepository')
    private creditCardsRepository: ICreditCardsRepository,

    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) {}

  public async execute(
    company_id: string,
    creditCardNumber?: number,
  ): Promise<void> {
    const creditCard = creditCardNumber
      ? await this.creditCardRepository.({
          where: { company_id, creditCardNumber },
        })
      : undefined;

    const transactions = await transactionsRepository.find({
      where: { company_id },
    });
    const account = await accountRepository.findOne({
      where: { company_id },
    });

    if (!account) {
      throw new AppError('This account does not exist');
    }

    const lastTransaction = transactions[transactions.length - 1];
    console.log(lastTransaction);


    calculateBalanceBasedOnLastTransaction();
  }
}

export default CalculateBalanceAndLimitService;
