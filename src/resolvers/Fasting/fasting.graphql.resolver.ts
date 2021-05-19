import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { FastingsRepository } from 'data/repositories'
// INPUT TYPES
import { FastingInput } from './types/fasting.input';
// OUTPUT TYPES
import { Fasting } from './types/fasting.object-type';

@Resolver()
export class FastingGraphQLResolver {

  constructor(
    private FastingsRepository: FastingsRepository,
  ) { }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => String)
  async createFasting(
    @Ctx() context: GraphQLContext,
    @Arg('fasting') fastingInput: FastingInput,
  ): Promise<string> {
    return await this.FastingsRepository.create(context.token.client._id, fastingInput)
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Query(returns => [Fasting])
  async getFasts(
    @Ctx() context: GraphQLContext,
    @Arg('actives') actives: boolean,
    @Arg('fastingId', { nullable: true }) fastingId: string,
  ): Promise<Fasting[]> {
    if (fastingId)
      return [
        await this.FastingsRepository.getById(context.token.client._id, fastingId)
      ]

    return []
  }
}
