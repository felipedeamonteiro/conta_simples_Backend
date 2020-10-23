import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';

interface IRequest {
  company_id: string;
  card_number: number | undefined;
}

@injectable()
class CalculateBalanceAndLimitService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute({ company_id, card_number }: IRequest): Promise<void> {
    const lastTransaction = await this.transactionsRepository.getLastAccountTransaction(
      company_id,
    );

    if (card_number) {
      if (!lastTransaction) {
        throw new AppError('There is no transactions for this account yet.');
      }

      const balanceOrLimit = await this.transactionsRepository.calculateBalanceOrLimitBasedOnLastTransaction(
        lastTransaction,
        company_id,
        card_number,
      );

      return balanceOrLimit;
    }

    if (!lastTransaction) {
      throw new AppError('There is no transactions for this account yet.');
    }

    const balanceOrLimit = await this.transactionsRepository.calculateBalanceOrLimitBasedOnLastTransaction(
      lastTransaction,
      company_id,
      card_number,
    );

    return balanceOrLimit;
  }
}

export default CalculateBalanceAndLimitService;
