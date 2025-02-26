import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productContent: Repository<Product>,
    private readonly couponContent: CouponsService
  ) { }
  async create(createTransactionDto: CreateTransactionDto) {

    await this.productContent.manager.transaction(async (transactionEntityManager) => {

      const transaction = new Transaction

      const total = createTransactionDto.contents.reduce((total, item) => total + (item.quantity * item.price), 0)

      transaction.total = total

      if (createTransactionDto.coupon) {
        const { cupon, message } = await this.couponContent.applycoupon(createTransactionDto.coupon)

        if (!cupon) {
          throw new NotFoundException('Cupón no válido')
        }
        transaction.coupon = cupon.name
        transaction.discount = (cupon.percentage / 100) * total
        const descuento = cupon.percentage / 100
        const subtotal = (total * descuento)
        transaction.total = total - subtotal
      }

      for (const content of createTransactionDto.contents) {
        const errors: string[] = []
        const product = await transactionEntityManager.findOneBy(Product, { id: content.productId })
        if (!product) {
          errors.push('Producto no encontrado')
          throw new NotFoundException(errors)
        }
        if (content.quantity > product.inventory) {
          errors.push('Cantidad no válida')
          throw new BadRequestException(errors)
        }
        product.inventory -= content.quantity

        //Creamos una instancia de Transaction

        const transactionContents = new TransactionContents()

        transactionContents.price = content.price
        transactionContents.product = product
        transactionContents.quantity = content.quantity
        transactionContents.transaction = transaction


        await transactionEntityManager.save(transaction)
        await transactionEntityManager.save(transactionContents)

      }
    })


    return { message: 'Venta Almacenada' };

  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: { contents: true }
    }

    if (transactionDate) {
      const date = parseISO(transactionDate)
      if (!isValid(date)) {
        throw new BadRequestException('Fecha no válida')
      }

      const day = startOfDay(date)
      const end = endOfDay(date)

      options.where = { transactionDate: Between(day, end) }
    }
    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const find = await this.transactionRepository.findOne({
      where: { id },
      relations: { contents: true }
    })

    if (!find) {
      throw new NotFoundException('Transacción no encontrada')
    }
    return find;
  }

  async remove(id: number) {

    const transaction = await this.findOne(id)

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada')
    }
    for (const contents of transaction.contents) {
      const product = await this.productContent.findOne({ where: { id: contents.product.id } })
      if (product) {
        product.inventory += contents.quantity

        await this.productContent.save(product)
      }


      const find = await this.transactionContentRepository.findOne({ where: { id: contents.id } })

      await this.transactionContentRepository.remove(find!)

    }

    await this.transactionRepository.remove(transaction)
    return 'Transaccion eliminada';
  }
}
