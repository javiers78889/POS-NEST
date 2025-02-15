import { IsNumberString, IsOptional } from 'class-validator'

export class GetProductQueryDto {
    @IsOptional()
    @IsNumberString({},{message:'La categoria debe ser un numero'})
    category_id?: number

    @IsOptional()
    @IsNumberString({},{message:'El take debe ser un numero'})
    take?: number

    @IsOptional()
    @IsNumberString({},{message:'El skip debe ser un numero'})
    skip?: number


}