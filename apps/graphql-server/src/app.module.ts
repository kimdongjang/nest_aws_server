import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './product/product.entity';
import { ProductModule } from './product/product.module';
import {TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // graphql을 사용하기 위한 apollo driver 사용      
      // typePaths: ['./**/*.graphql'], // gql스키마가 아닌 ts 스키마를 사용      
      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.ts'),
      // },

      // 구독 활성화용
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true
      },


      // debug: false,
      // playground: false,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
      

      // Code first 방식으로 schema.gql이라고 하는 파일이 자동 생성
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // sortSchema: true,
    }),
    ProductModule,
    // App 모듈에 ORM 엔티티 연결
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'test',
      entities:[join(__dirname, "/../**/*.entity.js")],
      synchronize:true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
