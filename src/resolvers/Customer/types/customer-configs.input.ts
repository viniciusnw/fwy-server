import { Field, InputType } from 'type-graphql';

@InputType()
export class CustomerConfigsInput {

  @Field({ nullable: true })
  chat: boolean;
  
  @Field({ nullable: true })
  weight: string;

  @Field({ nullable: true })
  height: string;

  @Field({ nullable: true })
  language: string;
}