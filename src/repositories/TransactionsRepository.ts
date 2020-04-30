import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const filterTypes = (
      transactions: Transaction[],
      type: string,
    ): Transaction[] =>
      transactions.filter(transaction => transaction.type === type);

    const reducer = (accumulator: number, transaction: Transaction): number =>
      accumulator + Number(transaction.value);

    const transactions = await this.find();
    const income = filterTypes(transactions, 'income').reduce(reducer, 0);
    const outcome = filterTypes(transactions, 'outcome').reduce(reducer, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
