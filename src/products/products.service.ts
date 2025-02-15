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
      take,skip
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
