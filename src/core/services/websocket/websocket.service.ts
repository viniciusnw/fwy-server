import { Container, Inject, Service } from 'typedi';
import { SERVICES_NAMES } from 'core/constants';
import { WSClients } from './websocket.config'
const WebSocket = require('ws');

@Service()
export class WSService {

  private WSClients: Array<WSClients>;

  constructor() { }

  private updateWSClients() {
    this.WSClients = Container.get(SERVICES_NAMES.WS_CLIENTS);
  }

  broadcastMessage(data) {
    this.updateWSClients();
    this.WSClients.forEach(s => s.socket.readyState === WebSocket.OPEN && s.socket.send(JSON.stringify({ data })));
  }

  clientMessage(customerId, data) {
    this.updateWSClients();
    this.WSClients.filter(ws => ws._id == customerId).map(ws => {
      if (ws && ws.socket.readyState === WebSocket.OPEN)
        ws.socket.send(JSON.stringify({ data }))
    });
  }
}