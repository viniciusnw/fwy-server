import * as path from 'path';
import * as cors from 'cors';
import * as express from 'express';
import * as compression from 'compression';

import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import bodyParser = require('body-parser');
import { ApolloServer } from 'apollo-server-express';
import { useExpressServer } from 'routing-controllers';

import { RunnerType } from 'core/types'
import { ENV_NAMES } from 'core/constants';
import { formatError, GlobalLoggerMiddleware } from 'core/middlewares';
import { getIpAddress, MemCachedConfigure, DbConfigure, WSConfigure } from 'core/services'

const { PORT, WSPORT, DEBUGPORT } = process.env;
const ROOT = path.join(__dirname, '..');
const ENABLE_GPL_PLAYGROUND = process.env.ENABLE_GPL_PLAYGROUND === 'true';


export default class Server implements RunnerType {

  private express: express.Application;

  public async configure() {
    await this.configureEnvValues();
    await this.configureWS();
    await this.configureDB();
    await this.configureCache();
    await this.configureExpress();
    await this.configureGraphQL();
  }

  private async configureWS() {
    console.info('Will connect WS');
    await Container.get(WSConfigure).connectToWS();
  }

  private async configureDB() {
    console.info('Will connect to MongoDB');
    await Container.get(DbConfigure).connectToDb();
  }

  private async configureCache() {
    console.info('Will connect to MemCached');
    await Container.get(MemCachedConfigure).connectToCache();
  }

  private async configureEnvValues() {
    console.info('Will set EnvValues');

    const {
      JWT,
      REST_API,
      USE_CACHE,
      DATABASE_URL,
      MEMCACHEDCLOUD,
      CACHE_EXPIRATION,
      CRYPTO_SECRET_KEY,
    } = ENV_NAMES

    // ENV
    Container.set('DEV_MODE', () => {
      const { NODE_ENV } = process.env;
      return NODE_ENV === 'development'
    });

    // MONGO
    Container.set(DATABASE_URL, process.env.DATABASE_URL);

    // REST
    Container.set(REST_API, {
      URL: process.env.MICROSERVICES_URL,
      EXPIRES_IN: process.env.MICROSERVICES_EXPIRES_IN,
      CLIENT_SECRET: process.env.MICROSERVICES_CLIENT_SECRET,
      CLIENT_ID: process.env.MICROSERVICES_CLIENT_ID,
    });

    // JWT
    Container.set(JWT, {
      EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
      SECRET_NEW: process.env.JWT_SECRET_NEW
    });
    Container.set(CRYPTO_SECRET_KEY, process.env.CRYPTO_SECRET_KEY);

    // CACHE
    Container.set(USE_CACHE, process.env.USE_CACHE === 'true');
    Container.set(MEMCACHEDCLOUD, {
      USERNAME: process.env.MEMCACHEDCLOUD_USERNAME,
      PASSWORD: process.env.MEMCACHEDCLOUD_PASSWORD,
      SERVERS: process.env.MEMCACHEDCLOUD_SERVERS,
      TIMEOUT: +process.env.MEMCACHEDCLOUD_TIMEOUT
    })
    Container.set(CACHE_EXPIRATION, {
      timezone: process.env.CACHE_EXPIRATION_TIMEZONE,
      dateOffset: +process.env.CACHE_EXPIRATION_DATE_OFFSET || 1,
      hour: +process.env.CACHE_EXPIRATION_HOUR || 0,
      minute: +process.env.CACHE_EXPIRATION_MINUTE || 0,
    });
  }

  private async configureExpress() {
    console.info('Will connect Express');

    let server = express();
    server.use(cors());
    server.use(compression());
    server.use(bodyParser.json({ limit: '50mb' }));
    server.disable('x-powered-by');
    useExpressServer(server, {
      defaultErrorHandler: false,
      controllers: [ROOT + '/**/*.controller.{ts,js}'],
    });
    this.express = server;
    this.express.listen(PORT);
  }

  private async configureGraphQL() {
    console.info('Will configure GraphQL');

    const graphQLSchema = await buildSchema({
      resolvers: [ROOT + '/**/*.resolver.{ts,js}'],
      globalMiddlewares: [GlobalLoggerMiddleware],
      container: Container
    });

    const graphQLServer = new ApolloServer({
      playground: ENABLE_GPL_PLAYGROUND,
      introspection: true,
      schema: graphQLSchema,
      formatError,
      tracing: true,
      context: ({ req }) => ({ ip: getIpAddress(req), request: req }),
    });
    graphQLServer.applyMiddleware({ app: this.express });
  }

  public async run(param: string): Promise<any> {
    console.info(`HTTP Listening to port ${PORT}`);
    console.info(`WS Listening to port ${WSPORT}`);
    console.info(`DEBUG Listening to port ${DEBUGPORT}`);
  }
}
