import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
    
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>
    ){

    }

    async createProduct(data: ProductDto){
        return await this.productRepository.create(data).save();
    }
    async getProducts() :Promise<Product[]|undefined>{
        return await this.productRepository.find();
    }

    async findOneById(id:number):Promise<Product|undefined> {
        return await this.productRepository.findOne({ where: { id: id } })

    }
    async findAll() : Promise<Product[]|undefined> {
        return await this.productRepository.find();
    }
    async deleteProduct(id: number): Promise<Boolean | undefined> {        
        const result =  await this.productRepository.delete({ id: id })
        if(result.affected === 0){
            throw new NotFoundException(`can't find product ${id}`);
        }
        return true;
    }

}
