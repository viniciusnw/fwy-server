import { Service } from 'typedi';
import { WSService } from 'core/services';
import { MongoDataSource } from 'data/datasource';

import { CustomerMessageEntity } from 'data/datasource/mongo/models'
import { Pagination } from 'resolvers/General/types/pagination.input'

@Service()
export class ChatRepository {

  private CustomerChatDBDataSource: MongoDataSource.CustomerChatDBDataSource
  private LoadCustomerChatDB(customerId: string) {
    this.CustomerChatDBDataSource = new MongoDataSource.CustomerChatDBDataSource(customerId);
  }
  
  constructor(
    private WSService: WSService
  ) { }

  public async sendMessage(comunicationIds: {
    clientId: string
    customerId?: string
  }, text: string, sender: string): Promise<any> {
    this.LoadCustomerChatDB(comunicationIds.customerId || comunicationIds.clientId);
    const message = { sender, text, date: new Date() };
    const saveMessage = await this.CustomerChatDBDataSource.create(message as CustomerMessageEntity);
    if (saveMessage && !saveMessage.errors) {
      const wsMessage = { type: 'NEW_MESSAGE', id: saveMessage._id, ...message };
      this.WSService.clientMessage(comunicationIds.clientId, wsMessage);
      if (comunicationIds?.customerId) this.WSService.clientMessage(comunicationIds.customerId, wsMessage);
    }
    else return false;
    return true;
  }

  public async getMessagesByCustomerId(customerId: string, pagination: Pagination): Promise<CustomerMessageEntity[]> {
    this.LoadCustomerChatDB(customerId);
    const { pageNumber, nPerPage } = pagination;
    return await this.CustomerChatDBDataSource.listPaginated(pageNumber, nPerPage);
  }
}