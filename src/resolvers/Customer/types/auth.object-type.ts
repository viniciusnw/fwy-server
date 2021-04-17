import { Customer } from 'resolvers/Customer/types/customer.object-type';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Auth extends Customer {

  @Field()
  token: string;

  @Field(type => Int)
  expirationTime: number;

  @Field()
  role: string
}
