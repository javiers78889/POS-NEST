import { IsNotEmpty } from "class-validator";

export class ApplyCouponDto {

    @IsNotEmpty({message:'El cupon no puede ir vacio'})
    coupon_name: string

}