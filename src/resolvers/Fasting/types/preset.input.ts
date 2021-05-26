import { InputType, Field } from 'type-graphql';

@InputType()
export class PresetInput {

  @Field()
  name: string

  @Field()
  hours: number

  @Field()
  days: number

  @Field()
  color: string

  @Field()
  index: number
}