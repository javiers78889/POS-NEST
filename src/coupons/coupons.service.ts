import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>

  ) { }

  create(createCouponDto: CreateCouponDto) {


    return this.couponRepository.save(createCouponDto)
  }

  findAll() {
    return this.couponRepository.find();
  }

  async findOne(id: number) {

    const coupon = await this.couponRepository.findOneBy({ id })
    const errores: string[] = []
    if (!coupon) {

      errores.push('Cupón no encontrado')
      throw new NotFoundException(errores)
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id)
    Object.assign(coupon, updateCouponDto)


    return await this.couponRepository.save(coupon);
  }

  async remove(id: number) {

    const coupon = await this.findOne(id)


    return this.couponRepository.remove(coupon);
  }

  async applycoupon(coupon: string) {

    const cupon = await this.couponRepository.findOne({ where: { name: coupon } })

    if (!cupon) {
      throw new NotFoundException('Cupón no encontrado')
    }

    const date = new Date()
    const expirationDate = endOfDay(cupon.expirationDate)

    if (isAfter(date, expirationDate)) {
      throw new BadRequestException('Cupón Expirado')
    }


    return {
      message: 'Cupon valido',
      cupon
    }
  }
}
