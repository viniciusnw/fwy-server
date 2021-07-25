import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { FastingsRepository } from 'data/repositories'
// INPUT TYPES
import { PresetInput } from './types/preset.input';
import { FastingInput } from './types/fasting.input';
import { FastingUpdateInput } from './types/fasting-update.input';
import { EndFastingInput } from './types/end-fasting.input';
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
  @Mutation(returns => Fasting)
  async editFasting(
    @Ctx() context: GraphQLContext,
    @Arg('id') fastingId: string,
    @Arg('fasting') fastingInput: FastingUpdateInput,
  ): Promise<Fasting> {
    return await this.FastingsRepository.edit(context.token.client._id, fastingId, fastingInput)
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => Fasting)
  async editStartEndFasting(
    @Ctx() context: GraphQLContext,
    @Arg('id') fastingId: string,
    @Arg('fasting') fastingInput: FastingUpdateInput,
  ): Promise<Fasting> {
    return await this.FastingsRepository.editStartEndDate(context.token.client._id, fastingId, fastingInput)
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => Boolean)
  async endFasting(
    @Ctx() context: GraphQLContext,
    @Arg('endFasting') endFasting: EndFastingInput,
  ): Promise<boolean> {
    return await this.FastingsRepository.endSaveById(context.token.client._id, endFasting)
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
      return await this.FastingsRepository.getActives(_id, true)

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
  @Mutation(returns => Boolean)
  async updatePreset(
    @Ctx() context: GraphQLContext,
    @Arg('preset') presetInput: PresetInput,
  ): Promise<boolean> {
    const { _id } = context.token.client
    return await this.FastingsRepository.updatePreset(_id, presetInput)
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
