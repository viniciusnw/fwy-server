import { Service } from "typedi";
import { encrypt, decrypt } from "core/services";
import { appleEmail } from "core/constants";
import { MongoDataSource } from "data/datasource";

// INPUT/OBJ TYPES
import { Pagination } from 'resolvers/General/types/pagination.input'
import { CustomerConfigsInput } from 'resolvers/Customer/types/customer-configs.input'
import { CustomerEntity, AvatarEntity, CustomerAdminEntity, CustomerConfigsEntity } from "data/datasource/mongo/models";
import { CustomerRegisterInput } from "resolvers/Customer/types/customer-register.input";
import { CustomerUpdateInput } from "resolvers/Customer/types/customer-update.input";
import { Avatar } from "resolvers/Customer/types/customer.object-type";
import { Token } from 'resolvers/General/types/token.object-type'

type CreateLoginModel = {
  email: string;
  password: string;
};

@Service()
export class CustomerRepository {

  constructor(
    private CustomerDBDataSource: MongoDataSource.CustomerDBDataSource,
    private CustomerAdminDBDataSource: MongoDataSource.CustomerAdminDBDataSource,
    private CustomerConfigsDBDataSource: MongoDataSource.CustomerConfigsDBDataSource
  ) { }

  public async getCustomerConfigs(customerId: string): Promise<CustomerConfigsEntity | null> {
    const configs = await this.CustomerConfigsDBDataSource.getByCustomerId(customerId);
    return configs || null
  }

  public async setCustomerConfigs(customerId: string, configs: CustomerConfigsInput): Promise<CustomerConfigsEntity> {
    const customerConfigs = await this.getCustomerConfigs(customerId);
    if (!customerConfigs)
      return await this.CustomerConfigsDBDataSource.create({
        customerId,
        ...configs
      } as CustomerConfigsEntity);
    else {
      const update = await this.CustomerConfigsDBDataSource.update(
        customerConfigs.toObject()._id,
        configs as CustomerConfigsEntity
      );
      const { ok } = update;
      if (!ok) throw Error("update configs error");
      return await this.getCustomerConfigs(customerId);
    }
  }

  public async getById(customerId: string): Promise<CustomerEntity> {
    const customer = await this.CustomerDBDataSource.get(customerId);
    return customer
  }

  private async listCustomers(pagination: Pagination): Promise<CustomerEntity[]> {
    const { pageNumber, nPerPage } = pagination;
    return await this.CustomerDBDataSource.listPaginated(pageNumber, nPerPage);
  }

  private async search(term: string, pagination: Pagination): Promise<CustomerEntity[]> {
    const { pageNumber, nPerPage } = pagination;
    return await this.CustomerDBDataSource.search(term, pageNumber, nPerPage);
  }

  public async listOrSearchCustomers(token: Token, term: string, pagination: Pagination): Promise<CustomerEntity[]> {
    let listCustomers: Array<CustomerEntity> = []

    if (token.client.email == appleEmail) {
      listCustomers = [await this.getById(token.client._id)];
    }
    else {
      if (term) listCustomers = await this.search(term, pagination);
      else listCustomers = await this.listCustomers(pagination);

      let filteredCustomers = listCustomers
        .filter(customer => customer.email != token.client.email)
        // .filter(customer => customer.email != appleEmail)
        .map(customer => customer.toObject());

      return filteredCustomers
    }

    return listCustomers
  }

  public async createAdmin(email: string): Promise<boolean> {
    const customer = await this.CustomerDBDataSource.getByEmail(email);

    if (customer) {
      const admin = await this.CustomerAdminDBDataSource.create({
        email: customer.email,
      } as CustomerAdminEntity);

      return !!admin.email
    }
    throw Error("E-mail not registered");
  }

  public async create(customerInput: CustomerRegisterInput): Promise<CustomerEntity> {
    const customer = await this.CustomerDBDataSource.getByEmail(customerInput.email);
    if (customer) throw Error("E-mail already exists");
    customerInput.password = encrypt(customerInput.password);
    const avatar = await this.createAvatarBufferEntity(customerInput);
    const createdCustomer = await this.CustomerDBDataSource.create({
      ...customerInput,
      avatar,
    } as CustomerEntity);
    return createdCustomer.toObject();
  }

  public async login(email: string, password: string, isAdmin?: boolean): Promise<CustomerEntity> {

    if (isAdmin) {
      const admin = await this.CustomerAdminDBDataSource.getByEmail(email)
      if (!admin) throw Error("Invalid email or password")
    }

    const customer = await this.CustomerDBDataSource.getByEmailAndPass(email, encrypt(password));
    if (!customer) throw Error("Invalid email or password");
    return customer.toObject()
  }

  public async update(id: string, customerInput: CustomerUpdateInput): Promise<CustomerEntity> {
    const avatar = await this.createAvatarBufferEntity(customerInput, id);
    const update = await this.CustomerDBDataSource.updateById(id, {
      ...customerInput,
      avatar,
    } as CustomerEntity);
    const { ok } = update;
    if (!ok) throw Error("update customer error");
    const customer = await this.CustomerDBDataSource.getById(id);
    return { ...customer } as CustomerEntity;
  }

  private async createAvatarBufferEntity(customerInput: CustomerRegisterInput, id?: string): Promise<AvatarEntity> {
    let avatar = null;
    if (customerInput.avatar) {
      avatar = {
        data: Buffer.from(customerInput.avatar.data, "base64"),
        type: customerInput.avatar.type,
      };
    }
    else {
      const customer = await this.CustomerDBDataSource.getById(id);
      avatar = customer?.avatar
    }
    return avatar;
  }

  public createAvatarObjectType(customer: CustomerEntity): Avatar {
    let avatar = null;
    if (customer?.avatar?.data && customer?.avatar?.type) {
      avatar = {
        type: customer.avatar.type,
        data: customer.avatar.data.toString('base64'),
      };
    }
    return avatar;
  }

  public createLoginModel(customer: CustomerEntity): CreateLoginModel {
    return { email: customer.email, password: decrypt(customer.password) };
  }
}
