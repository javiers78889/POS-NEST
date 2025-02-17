import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({ where: { id: createProductDto.categoryId } })
    if (!category) {
      let error: string[] = []
      error.push('La categoria no existe')
      throw new NotFoundException(error)
    }
    createProductDto.categoryId = category.id
    return this.productRepository.save({ ...createProductDto, category })
  }

  async findAll(category?: number, take?: number, skip?: number) {
    const option: FindManyOptions<Product> = {
      relations: {
        category: true
      }, order: {
        'id': 'DESC'
      },
      take, skip
    }
    if (category) {
      option.where = {
        category: {
          id: category
        }
      }
    }




    const [products, total] = await this.productRepository.findAndCount({ ...option })
    return {
      products,
      total
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: { category: true } })
    if (!product) {
      throw new NotFoundException(`El producto con el Id ${id} no fue encotrado`)
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const product = await this.findOne(id)
    Object.assign(product, updateProductDto)

    if (updateProductDto.categoryId) {

      const category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId } })
      if (!category) {
        let error: string[] = []
        error.push('La categoria no existe')
        throw new NotFoundException(error)
      }
      product.category = category

    }

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id)
    if (!product) {
      let error: string[] = []
      error.push('El producto no existe')
      throw new NotFoundException(error)
    }
    await this.productRepository.remove([product])
    return `Producto eliminado`;
  }
}
