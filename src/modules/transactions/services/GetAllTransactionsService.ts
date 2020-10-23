import { injectable, inject } from 'tsyringe';

import Transaction from '../infra/typeorm/entities/Transaction';

import ITransactionsRepository from '../repositories/ITransactionsRepository';

@injectable()
class GetAllTransactionsService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute(company_id: string): Promise<Transaction[] | undefined> {
    const transactions = await this.transactionsRepository.getAllAccountTransactions(
      company_id,
    );

    return transactions;
  }
}

export default GetAllTransactionsService;
