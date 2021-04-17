const util = require('util');
import { GraphQLContext } from 'resolvers/graphql.context';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Service } from 'typedi';

// import * as newrelic from 'newrelic';
// newrelic.setTransactionName(name);

@Service()
export class GlobalLoggerMiddleware implements MiddlewareInterface<GraphQLContext> {
  constructor() { }

  async use({ context, info }: ResolverData<GraphQLContext>, next: NextFn) {
    if (!context.dataLoaderInitialized) {
      const operation = info.operation.operation.toLocaleUpperCase();
      const method = info.operation.name ? info.operation.name.value : ""
      console.info(`[${operation}][${method}][INPUT]:`, util.inspect(info.variableValues, false, null, true));
    }

    try {
      context.dataLoaderInitialized = true;
      return await next();
    } catch (err) {
      console.info('[ERROR]: ', err)
      throw err;
    }
  }
}