import { ObjectType, Field } from 'type-graphql';
import { NextPagination } from 'resolvers/General/types/next-pagination.input'

@ObjectType()
class Message {

  @Field({ nullable: true })
  _id: string;

  @Field()
  text: string;

  @Field()
  sender: string;

  @Field(type => Date)
  date: Date
}

@ObjectType()
export class GetChatMessages {

  @Field(type => [Message], { nullable: true })
  messages: Message[]

  @Field(type => NextPagination)
  nextPagination: NextPagination
}