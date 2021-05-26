import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Fasting {

  @Field()
  _id: string

  @Field()
  name: string

  @Field(type => Date)
  startDate: Date

  @Field(type => Date)
  endDate: Date

  @Field()
  color: string

  @Field({ nullable: true })
  finished?: Date
}