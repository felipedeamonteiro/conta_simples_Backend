import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import ITransactionsRepository from '@modules/transactions/repositories/ITransactionsRepository';

@injectable()
class CalculateBalanceAndLimitService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute(
    company_id: string,
    credit_card_number: number | undefined,
  ): Promise<void> {
    const lastTransaction = await this.transactionsRepository.getLastAccountTransaction(
      company_id,
    );

    if (credit_card_number) {
      if (!lastTransaction) {
        throw new AppError('There is no transactions for this account yet.');
      }

      const balanceOrLimit = await this.transactionsRepository.calculateBalanceOrLimitBasedOnLastTransaction(
        lastTransaction,
        company_id,
        credit_card_number,
      );

      return balanceOrLimit;
    }

    if (!lastTransaction) {
      throw new AppError('There is no transactions for this account yet.');
    }

    const balanceOrLimit = await this.transactionsRepository.calculateBalanceOrLimitBasedOnLastTransaction(
      lastTransaction,
      company_id,
      credit_card_number,
    );

    return balanceOrLimit;
  }
}

export default CalculateBalanceAndLimitService;
