import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CustomerConfigs {

  @Field({ nullable: true })
  chat: boolean;
  
  @Field({ nullable: true })
  weight: string;

  @Field({ nullable: true })
  height: string;

  @Field({ nullable: true })
  language: string;
}