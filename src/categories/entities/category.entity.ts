import { Product } from 'src/products/entities/product.entity'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 60 })
    name: string

    @OneToMany(() => Product, (product) => product.category, { cascade: true })
    product: Product[]
}
