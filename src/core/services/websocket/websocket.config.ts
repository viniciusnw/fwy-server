
import { SERVICES_NAMES, ENV_NAMES } from 'core/constants'
import { JwtService } from 'core/services';
import { Container, Service, Inject } from 'typedi';
import { Token } from 'resolvers/General/types/token.object-type'

const WebSocket = require('ws');
const { WSPORT } = process.env;

export interface WSClients {
  _id: string,
  socket: WebSocket
}

@Service()
export class WSConfigure {

  private WSS: any;
  private WSClients: Array<WSClients> = [];
  private jwtService: JwtService = Container.get(JwtService);

  constructor(
    @Inject(ENV_NAMES.DEV) protected DEV,
  ) {
    Container.set(SERVICES_NAMES.WS_CLIENTS, this.WSClients);
  }

  private checkAuthentication(req): Token {
    const { authorization } = req.headers;
    if (!authorization) return null;
    const tokenDecrypted = this.jwtService.verify(authorization);
    if (!tokenDecrypted) return null;
    return tokenDecrypted;
  }

  private connection(socket, req) {
    const tokenDecrypted = this.checkAuthentication(req);
    if (!tokenDecrypted) return socket.close(1000, 'Unauthorized');

    const { client: { _id } } = tokenDecrypted;
    this.WSClients.push({ _id, socket });
    if (this.DEV) {
      console.log(`[WS][CONNECT]:`, _id);
    }
    Container.set(SERVICES_NAMES.WS_CLIENTS, this.WSClients);
  }

  private closeConnection(socket) {
    socket.on('close', () => {
      this.WSClients = this.WSClients.filter(s => {
        if (s.socket !== socket) return true
        else {
          if (this.DEV) {
            console.log(`[WS][DISCONNECT]:`, s._id);
          }
        }
      });
      Container.set(SERVICES_NAMES.WS_CLIENTS, this.WSClients);
    });
  }

  public async connectToWS() {
    this.WSS = new WebSocket.Server({ port: WSPORT });
    this.WSS.on('connection', this.connection.bind(this));
    this.WSS.on('connection', this.closeConnection.bind(this));
  }
}