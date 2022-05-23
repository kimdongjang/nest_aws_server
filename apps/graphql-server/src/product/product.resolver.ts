import { ParseIntPipe } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Int } from "type-graphql";
import { DeleteResult } from "typeorm";
import { ProductDto } from "./product.dto";
import { Product } from "./product.entity";
import { InputProduct } from "./product.input";
import { ProductService } from "./product.service";


/**
 * 스키마에 따라 Query와 Mutation을 매핑하는 메소드 작성
 */
@Resolver(of => ProductDto)
export class ProductResolver  {
    constructor(
        // Product Service Inject
        private readonly productService: ProductService,
    ){

    }

    @Query(returns => [ProductDto])
    async getProducts() : Promise<ProductDto[]>{
        return await this.productService.getProducts();
    }
    @Query(returns => ProductDto)
    async findOneById(@Args('id', ParseIntPipe) id: number ) : Promise<ProductDto>{
      return await this.productService.findOneById(id);
    }  
    

    @Mutation(returns => ProductDto)
    async createProduct(@Args('data') data: InputProduct) : Promise<ProductDto>{
        return await this.productService.createProduct(data);
    }

    @Mutation(returuns => Boolean)
    async deleteProduct(@Args('id') id: number) : Promise<Boolean>{
        return await this.productService.deleteProduct(id);
    }

    

    // @ResolveField('posts', returns => [Product])
    // async getPosts() {
    //   return this.productService.findAll();
    // }
}