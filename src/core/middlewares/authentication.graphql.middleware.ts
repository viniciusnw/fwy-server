const util = require('util');
import { MiddlewareInterface, ResolverData } from 'type-graphql';
import { Service } from 'typedi';

import { JwtService } from 'core/services';
import { JwtValidationError } from 'core/errors';
import { GraphQLContext } from 'resolvers/graphql.context';

@Service()
export class AuthenticationGraphQLMiddleware implements MiddlewareInterface<GraphQLContext> {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async use({ args, context, info, root }: ResolverData<GraphQLContext>, next: () => void) {
    const { request = {} } = context;
    const { headers = {} } = request;
    
    const { authorization } = headers;
    console.log('[MIDDLEWARE][Authentication][HEADERS]:', util.inspect(headers, false, null, true));

    if (authorization) {
      const tokenDecrypted = this.jwtService.verify(authorization);
      if (!tokenDecrypted) throw new JwtValidationError(null, 400);
    }
    else throw new JwtValidationError('[MIDDLEWARE][Authentication][HEADERS]: Jwt not found', 400);
    
    return next();
  }
}
