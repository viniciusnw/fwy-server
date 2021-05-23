import { InputType, Field } from 'type-graphql';

@InputType()
export class FastingInput {

  @Field()
  name: string

  @Field(type => Date)
  startDate: Date

  @Field(type => Date)
  endDate: Date

  @Field()
  color: string

  @Field({ nullable: true })
  finished: Date
}