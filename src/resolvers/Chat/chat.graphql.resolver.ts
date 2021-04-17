import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { ChatRepository } from 'data/repositories'
// INPUT TYPES
// OUTPUT TYPES

@Resolver()
export class GeneralGraphQLResolver {

  constructor(
    private ChatRepository: ChatRepository,
  ) { }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => Boolean)
  async sendChatMenssage(
    @Ctx() context: GraphQLContext,
    @Arg('text') text: string,
    @Arg('sender') sender: string,
    @Arg('customerId') customerId: string,
  ): Promise<boolean> {
    return await this.ChatRepository.sendMessage(customerId, text, sender)
  }
}
