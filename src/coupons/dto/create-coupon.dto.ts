import { IsDateString, IsInt, IsNotEmpty, IsNumber, Max, Min } from "class-validator"

export class CreateCouponDto {
    @IsNotEmpty({ message: 'El nombre no puede ir vacio' })
    name: string

    @IsNotEmpty({ message: 'El descuento no puede ir vacio' })
    @IsInt({ message: 'El descuento debe ser entre 1 y 100' })
    @Max(100, { message: 'El descuento maximo es de 100' })
    @Min(1, { message: 'El descuento minimo es 1' })
    percentage: number
    @IsNotEmpty({ message: 'la fecha de expiracion no puede ir vacio' })
    @IsDateString({},{message:'Formato de fecha no valido'})
    expirationDate: Date


}
