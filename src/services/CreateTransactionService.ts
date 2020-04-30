import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Transaction value invalid.');
    }

    const categoriesRepository = getRepository(Category);

    let categoryFound = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryFound) {
      categoryFound = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryFound);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryFound.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
