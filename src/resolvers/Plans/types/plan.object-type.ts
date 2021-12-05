import { ObjectType, Field } from 'type-graphql';

@ObjectType()
class Plan {

  @Field()
  id: string;
}

@ObjectType()
export class ListPlans {

  @Field(type => [Plan])
  plans: Plan[]
}