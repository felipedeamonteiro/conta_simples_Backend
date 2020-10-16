import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

@EntityRepository(Transaction)
class TransactionRepository extends Repository<Transaction> {
  /**
   * FindTransactionBySameCard
   */
  public async FindTransactionBySameCard(
    card_number: string,
  ): Promise<Transaction[] | null> {
    const findTransaction = await this.find({
      where: { card_number },
    });

    return findTransaction || null;
  }

  public async getBalance();
}

export default TransactionRepository;
