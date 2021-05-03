import { Field, InputType } from 'type-graphql';

@InputType()
export class Pagination {

  @Field()
  pageNumber: number
  
  @Field()
  nPerPage: number
}