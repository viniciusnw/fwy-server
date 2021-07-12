import { InputType, Field } from 'type-graphql';

@InputType()
export class PictureInput {

  @Field()
  type: string;

  @Field()
  data: string;
}


@InputType()
export class EndFastingInput {

  @Field()
  save: boolean

  @Field()
  fastingId: string

  @Field(type => Date, { nullable: true })
  customEndDate: Date

  @Field({ nullable: true })
  howFelling: number

  @Field({ nullable: true })
  notes: string

  @Field(type => PictureInput, { nullable: true })
  picture: PictureInput
}