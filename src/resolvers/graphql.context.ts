import { Token } from './General/types/token.object-type'

export class GraphQLContext {
  ip?: string;
  token: Omit<Token, 'avatar'>;
  request: any;
  dataLoaderInitialized?: boolean;
}