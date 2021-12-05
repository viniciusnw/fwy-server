import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { PlansRepository } from 'data/repositories'
// INPUT TYPES

// OUTPUT TYPES
import { ListPlans } from './types/plan.object-type';

@Resolver()
export class PlansGraphQLResolver {

  constructor(
    private PlansRepository: PlansRepository,
  ) { }

  // @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Query(returns => ListPlans)
  async plans(
    @Ctx() context: GraphQLContext,
  ): Promise<ListPlans> {
    const plans = await this.PlansRepository.list();
    return plans;
  }
}
