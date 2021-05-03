import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { ChatRepository } from 'data/repositories'
// INPUT TYPES
import { Pagination } from 'resolvers/General/types/pagination.input'
// OUTPUT TYPES
import { NextPagination } from 'resolvers/General/types/next-pagination.input'
import { GetChatMessages } from './types/customer-login.object-type'

@Resolver()
export class GeneralGraphQLResolver {

  constructor(
    private ChatRepository: ChatRepository,
  ) { }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => Boolean)
  async sendChatMessage(
    @Ctx() context: GraphQLContext,
    @Arg('text') text: string,
    @Arg('customerId', { nullable: true }) customerId: string,
  ): Promise<boolean> {
    const { _id } = context.token.client;
    const senders = ['self', 'adm'];
    const sender = senders[customerId ? 1 : 0];
    return await this.ChatRepository.sendMessage(customerId || _id, text, sender);
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Query(returns => GetChatMessages)
  async getChatMessages(
    @Ctx() context: GraphQLContext,
    @Arg('pagination') pagination: Pagination,
  ): Promise<GetChatMessages> {
    const { _id: customerId } = context.token.client;
    const messages = await this.ChatRepository.getMessagesByCustomerId(customerId, pagination);
    const hasNextPage = messages.length == pagination.nPerPage;
    const nextPagination = {
      ...pagination,
      nextPageNumber: hasNextPage ? pagination.pageNumber + 1 : null
    } as NextPagination;

    const response = {
      messages: messages.reverse(),
      nextPagination
    };

    return response;
  }
}
