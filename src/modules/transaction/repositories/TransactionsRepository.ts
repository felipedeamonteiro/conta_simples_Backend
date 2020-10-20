import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../infra/typeorm/entities/Transaction';

@EntityRepository(Transaction)
class TransactionRepository extends Repository<Transaction> {
  /**
   * FindTransactionBySameCard
   */
  public async FindTransactionBySameCard(
    card_number: string,
  ): Promise<Transaction[] | undefined> {
    const findTransaction = await this.find({
      where: { card_number },
    });

    return findTransaction || undefined;
  }
}

export default TransactionRepository;
