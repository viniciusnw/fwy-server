import { ObjectType, Field } from 'type-graphql';
import { NextPagination } from 'resolvers/General/types/next-pagination.object-type'
import { Customer } from './customer.object-type'

@ObjectType()
export class CustomerList {

  @Field(type => [Customer], { nullable: true })
  customers: Customer[] | null

  @Field(type => NextPagination)
  nextPagination: NextPagination
}