import { Field, InputType } from 'type-graphql';

@InputType()
export class CustomerRegisterInput {

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  birthday: string;

  @Field()
  country: string;
  
  @Field()
  state: string;
  
  @Field()
  password: string;

  @Field({ nullable: true })
  gender: string;
  
  @Field({ nullable: true })
  weight: number;

  @Field({ nullable: true })
  height: number;

  @Field({ nullable: true })
  avatar: string;
}