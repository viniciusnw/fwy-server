import { Service } from 'typedi';
import { WSService } from 'core/services';
import { MongoDataSource } from 'data/datasource';
import { CustomerChatEntity } from 'data/datasource/mongo/models'

@Service()
export class ChatRepository {

  private CustomerChatDBDataSource: MongoDataSource.CustomerChatDBDataSource

  constructor(
    private WSService: WSService
  ) { }

  public async sendMessage(customerId: string, text: string, sender: string): Promise<any> {
    this.CustomerChatDBDataSource = new MongoDataSource.CustomerChatDBDataSource(customerId);
    const message = { sender, text, date: `${new Date}` };
    const saveMessage = await this.CustomerChatDBDataSource.create(message as CustomerChatEntity);
    if (saveMessage && !saveMessage.errors) {
      const wsMessage = { type: 'NEW_MESSAGE', id: saveMessage._id, ...message };
      this.WSService.clientMessage(customerId, wsMessage);
    }
    else return false;
    return true;
  }
}