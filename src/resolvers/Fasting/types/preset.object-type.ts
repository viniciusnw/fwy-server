import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Preset {

  @Field()
  _id: string

  @Field()
  name: string

  @Field()
  days: number

  @Field()
  hours: number

  @Field()
  color: string

  @Field()
  index: number
}