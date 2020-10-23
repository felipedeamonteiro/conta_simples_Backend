import { injectable, inject } from 'tsyringe';

import Transaction from '../infra/typeorm/entities/Transaction';

import ITransactionsRepository from '../repositories/ITransactionsRepository';

@injectable()
class GetLastTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute(company_id: string): Promise<Transaction | undefined> {
    const transaction = await this.transactionsRepository.getLastAccountTransaction(
      company_id,
    );

    return transaction;
  }
}

export default GetLastTransactionService;
