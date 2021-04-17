import { Field, InputType } from 'type-graphql';

@InputType()
export class CustomerUpdateInput {

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  birthday: string;

  @Field({ nullable: true })
  gender: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  weight: number;

  @Field({ nullable: true })
  height: number;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  avatar: string;
}