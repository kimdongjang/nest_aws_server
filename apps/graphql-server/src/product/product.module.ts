import { Module } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import {TypeOrmModule } from '@nestjs/typeorm';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [
    // Product 모듈에 Product 엔티티 참조
    TypeOrmModule.forFeature([Product])
  ],
  providers: [ProductService, ProductResolver]
})
export class ProductModule {}
