import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { FastingsRepository } from 'data/repositories'
// INPUT TYPES
import { FastingInput } from './types/fasting.input';
import { PresetInput } from './types/preset.input';
// OUTPUT TYPES
import { Fasting } from './types/fasting.object-type';
import { Preset } from './types/preset.object-type';

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
  @Mutation(returns => Boolean)
  async editFasting(
    @Ctx() context: GraphQLContext,
    @Arg('fasting') fastingInput: FastingInput,
  ): Promise<boolean> {
    return true
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => Boolean)
  async endFasting(
    @Ctx() context: GraphQLContext,
    @Arg('save') save: boolean,
    @Arg('fastingId') fastingId: string,
  ): Promise<boolean> {
    return await this.FastingsRepository.endSaveById(context.token.client._id, fastingId, save)
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

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => Boolean)
  async createPreset(
    @Ctx() context: GraphQLContext,
    @Arg('preset') presetInput: PresetInput,
  ): Promise<boolean> {
    const { _id } = context.token.client
    return await this.FastingsRepository.savePreset(_id, presetInput)
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Query(returns => [Preset])
  async getPresets(
    @Ctx() context: GraphQLContext,
  ): Promise<Preset[]> {
    const { _id } = context.token.client
    return await this.FastingsRepository.getPresets(_id)
  }
}
