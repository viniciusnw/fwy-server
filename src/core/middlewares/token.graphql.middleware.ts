import { Service } from 'typedi';
import { MiddlewareInterface, ResolverData } from 'type-graphql';

import { JwtService } from 'core/services';
import { GraphQLContext } from 'resolvers/graphql.context';

import { Token } from 'resolvers/General/types/token.object-type'

@Service()
export class TokenGraphQLMiddleware implements MiddlewareInterface<GraphQLContext> {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async use({ context, args }: ResolverData<GraphQLContext>, next: () => void) {
    if (context) context.token = null;
    const { request = {} } = context;
    const { headers = {} } = request;

    const { authorization } = headers;

    if (authorization) {
      const tokenDecrypted = this.jwtService.decode(authorization);
      if (tokenDecrypted) context.token = { ...tokenDecrypted } as Token;
    }
    return next();
  }
}
