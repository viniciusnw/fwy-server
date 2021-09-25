import { Token } from './General/types/token.object-type'

export class GraphQLContext {
  ip?: string;
  token: Token;
  request: any;
  dataLoaderInitialized?: boolean;
}