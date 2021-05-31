import { InputType, Field } from 'type-graphql';

@InputType()
export class FastingUpdateInput {

  @Field({ nullable: true })
  name: string

  @Field(type => Date, { nullable: true })
  startDate: Date

  @Field(type => Date, { nullable: true })
  endDate: Date

  @Field({ nullable: true })
  color: string

  @Field({ nullable: true })
  finished: Date
}