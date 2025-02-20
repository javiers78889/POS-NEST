import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    const category = new Category
    category.name = createCategoryDto.name
    this.categoryRepository.save(category)
    return 'Categoria creada';
  }

  findAll() {

    const todo = this.categoryRepository.find()
    return todo;
  }

  async findOne(id: number, products?: boolean) {

    const options: FindManyOptions<Category> = {
      where: { id }
    }

    if (products) {
      options.relations = {
        product: true
      }
    }
    const find = await this.categoryRepository.findOne(options)
    if (!find) {
      throw new NotFoundException('La categoria no existe')
    }
    return find;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)

    category.name = updateCategoryDto.name


    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id)

    return this.categoryRepository.delete(category);
  }
}
