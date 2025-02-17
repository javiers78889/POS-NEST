import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productContent: Repository<Product>
  ) { }
  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = new Transaction

    transaction.total = createTransactionDto.total

    await this.transactionRepository.save(transaction)

    for (const content of createTransactionDto.contents) {
      const product = await this.productContent.findOneBy({ id: content.productId })
      if (!product) {
        throw new NotFoundException('Producto no encontrado')
      }
      if (content.quantity > product.inventory) {
        return 'Cantidad no valida'
      }
      product.inventory -= content.quantity
      await this.transactionContentRepository.save({ ...content, transaction, product })

    }

    return 'Venta Almacenada';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
