import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Avatar {
  
  @Field()
  type: string;

  @Field()
  data: string;
}

@ObjectType()
export class Customer {

  @Field()
  _id: string;

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
  
  @Field({ nullable: true })
  gender: string;

  @Field({ nullable: true })
  weight: number;

  @Field({ nullable: true })
  height: number;

  @Field(type => Avatar, { nullable: true })
  avatar?: Avatar;
}
