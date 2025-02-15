import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator'


export class CreateProductDto {
    @IsNotEmpty({ message: 'Nombre del Producto es obligatorio' })
    @IsString({ message: 'Usuario no valido' })
    name: string
    @IsNotEmpty({ message: 'Precio es obligatorio' })
    @IsNumber({ maxDecimalPlaces: 2 },{message:'Precio no valido'})
    price: number
    @IsNotEmpty({ message: 'Inventario es obligatorio' })
    @IsNumber({ maxDecimalPlaces: 0 },{message:'Cantidad no valida'})
    inventory: number
    @IsNotEmpty({ message: 'Categoria es obligatorio' })
    @IsInt({message: 'Categoria no valida'})
    categoryId: number
}
