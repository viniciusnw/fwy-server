import { Field, InputType } from 'type-graphql';

@InputType()
class AvatarUpdate {
  
  @Field()
  type: string;

  @Field()
  data: string;
}

@InputType()
export class CustomerUpdateInput {

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field(type => Date, { nullable: true })
  birthday: Date;

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

  @Field(type => AvatarUpdate, { nullable: true })
  avatar?: AvatarUpdate;
}