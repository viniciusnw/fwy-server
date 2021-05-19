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
  @Mutation(returns => String)
  async endFasting(
    @Ctx() context: GraphQLContext,
    @Arg('fastingId') fastingId: string,
  ): Promise<boolean> {
    return await this.FastingsRepository.endById(context.token.client._id, fastingId)
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Query(returns => [Fasting])
  async getFasts(
    @Ctx() context: GraphQLContext,
    @Arg('actives', { nullable: true }) actives: boolean,
    @Arg('fastingId', { nullable: true }) fastingId: string,
  ): Promise<Fasting[]> {
    const { _id } = context.token.client

    if (actives)
      return await this.FastingsRepository.getActives(_id)

    if (fastingId)
      return [
        await this.FastingsRepository.getById(_id, fastingId)
      ]

    return []
  }
}
