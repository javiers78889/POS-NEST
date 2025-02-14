// create-category.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de la categoria no puede ir vacío' })
    name: string;
}
