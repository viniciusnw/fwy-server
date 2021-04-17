import { Field, Int, ObjectType } from 'type-graphql';

import { Customer } from 'resolvers/Customer/types/customer.object-type'

@ObjectType()
export class Token {

  @Field(type => Customer)
  client: Customer;

  @Field()
  role: string;

  @Field()
  retoken: string;

  @Field()
  iat: number;
  
  @Field()
  exp: number;
}
