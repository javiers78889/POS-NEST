import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Repository, DataSource } from 'typeorm';
import { categories } from './data/categories';
import { products } from './data/product';

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private dataSource: DataSource
    ) { }

    async onModuleInit() {
        const connection = this.dataSource

        await connection.dropDatabase()
        await connection.synchronize()
    }
    async seed() {
        await this.categoryRepository.save(categories)

        for await (const seedProduct of products) {
            const category = await this.categoryRepository.findOneBy({ id: seedProduct.categoryId })
            const product = new Product()

            if (!category) {

                throw new NotFoundException('Categoria no encontrada')
            }


            product.category = category
            product.image = seedProduct.image
            product.inventory = seedProduct.inventory
            product.name = seedProduct.name
            product.price = seedProduct.price


            await this.productRepository.save(product)


        }
    }
}
