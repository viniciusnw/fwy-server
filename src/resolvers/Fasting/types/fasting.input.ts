import { InputType, Field } from 'type-graphql';
import { NextPagination } from 'resolvers/General/types/next-pagination.input'

@InputType()
export class FastingInput {

  @Field()
  name: string

  @Field(type => Date)
  startDate: Date

  @Field(type => Date)
  endDate: Date

  @Field()
  color: string

  @Field()
  index: number
}