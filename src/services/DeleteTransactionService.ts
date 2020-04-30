import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    try {
      const transactionsRepository = getCustomRepository(
        TransactionsRepository,
      );

      await transactionsRepository.delete(id);
    } catch (err) {
      throw new AppError('Transaction not found');
    }
  }
}

export default DeleteTransactionService;
