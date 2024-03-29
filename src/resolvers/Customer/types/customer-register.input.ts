import { Field, InputType } from 'type-graphql';

@InputType()
class AvatarInput {
  
  @Field()
  type: string;

  @Field()
  data: string;
}

@InputType()
export class CustomerRegisterInput {

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field(type => Date)
  birthday: Date;

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

  @Field(type => AvatarInput, { nullable: true })
  avatar?: AvatarInput;
}