import { Service } from "typedi";
import { encrypt, decrypt } from "core/services";
import { MongoDataSource } from "data/datasource";

// INPUT TYPES
import { Pagination } from 'resolvers/General/types/pagination.input'
import { CustomerConfigsInput } from 'resolvers/Customer/types/customer-configs.input'
import { CustomerEntity, AvatarEntity, CustomerAdminEntity, CustomerConfigsEntity } from "data/datasource/mongo/models";
import { CustomerRegisterInput } from "resolvers/Customer/types/customer-register.input";
import { CustomerUpdateInput } from "resolvers/Customer/types/customer-update.input";
import { Avatar } from "resolvers/Customer/types/customer.object-type";

type CreateLoginModel = {
  email: string;
  password: string;
};

@Service()
export class CustomerRepository {

  private CustomerConfigsDBDataSource: MongoDataSource.CustomerConfigsDBDataSource
  private LoadCustomerConfigsDB(customerId: string) {
    this.CustomerConfigsDBDataSource = new MongoDataSource.CustomerConfigsDBDataSource(customerId);
  }

  constructor(
    private CustomerDBDataSource: MongoDataSource.CustomerDBDataSource,
    private CustomerAdminDBDataSource: MongoDataSource.CustomerAdminDBDataSource,
  ) { }

  public async getCustomerConfigs(customerId: string): Promise<CustomerConfigsEntity | null> {
    this.LoadCustomerConfigsDB(customerId);
    const config = await this.CustomerConfigsDBDataSource.list();
    return config[0] || null
  }

  public async setCustomerConfigs(customerId: string, configs: CustomerConfigsInput): Promise<CustomerConfigsEntity> {
    this.LoadCustomerConfigsDB(customerId);
    return await this.CustomerConfigsDBDataSource.create(configs as CustomerConfigsEntity);
  }

  public async getById(customerId: string): Promise<CustomerEntity> {
    const customer = await this.CustomerDBDataSource.get(customerId);
    return customer
  }

  public async listCustomers(pagination: Pagination): Promise<CustomerEntity[]> {
    const { pageNumber, nPerPage } = pagination;
    return await this.CustomerDBDataSource.listPaginated(pageNumber, nPerPage);
  }

  public async search(term: string, pagination: Pagination): Promise<CustomerEntity[]> {
    const { pageNumber, nPerPage } = pagination;
    return await this.CustomerDBDataSource.search(term, pageNumber, nPerPage);
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
