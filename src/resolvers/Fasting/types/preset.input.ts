import { InputType, Field } from 'type-graphql';

@InputType()
export class PresetInput {

  @Field({ nullable: true })
  id: string

  @Field({ nullable: true })
  index: number

  @Field()
  name: string

  @Field()
  hours: number

  @Field()
  days: number

  @Field({ nullable: true })
  color: string
}