import { ObjectType, Field, Int } from "@nestjs/graphql";

/**
 * GraphQL 출력타입으로 사용할 데이터 오브젝트
 */
@ObjectType()
export class ProductDto {
    @Field()
    readonly id?: number;
    @Field()
    readonly title!: string;
    @Field(() => Int)
    readonly price!: number;
}