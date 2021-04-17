import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { GeneralRepository } from 'data/repositories'
// OUTPUT TYPES

@Resolver()
export class GeneralGraphQLResolver {

  constructor(
    private GeneralRepository: GeneralRepository,
  ) { }

  @UseMiddleware(TokenGraphQLMiddleware)
  @Query(returns => [String])
  async countriesAndStates(
    @Ctx() context: GraphQLContext,
    @Arg('country', { nullable: true }) country: string,
  ): Promise<String[]> {
    
    if (country) return await this.GeneralRepository.states(country)
    return await this.GeneralRepository.countries()
  }
}
