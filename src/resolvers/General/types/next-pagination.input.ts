import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class NextPagination {

  @Field()
  pageNumber: number

  @Field()
  nPerPage: number

  @Field({ nullable: true })
  nextPageNumber: number
}