import { Service } from 'typedi';
import { encrypt, decrypt } from 'core/services';
import { MongoDataSource, JSONDataSource } from 'data/datasource';
import { CustomerEntity } from 'data/datasource/mongo/models'

// INPUT TYPES
import { CustomerRegisterInput } from 'resolvers/Customer/types/customer-register.input'
import { CustomerUpdateInput } from 'resolvers/Customer/types/customer-update.input'


@Service()
export class CustomerRepository {

  constructor(
    private CustomerDBDataSource: MongoDataSource.CustomerDBDataSource,
  ) { }

  public async create(customerInput: CustomerRegisterInput): Promise<CustomerEntity> {
    const customer = await this.CustomerDBDataSource.getByEmail(customerInput.email);
    if (customer) throw Error('e-mail already exists');
    customerInput.password = encrypt(customerInput.password);
    const createdCustomer = await this.CustomerDBDataSource.create({ ...customerInput } as CustomerEntity);
    return createdCustomer.toObject();
  }

  public async login(email: string, password: string): Promise<CustomerEntity> {
    const customer = await this.CustomerDBDataSource.getByEmailAndPass(email, encrypt(password));
    if (!customer) throw Error('Invalid email or password');
    return customer.toObject();
  }

  public async update(id: string, customerInput: CustomerUpdateInput): Promise<CustomerEntity> {
    const update = await this.CustomerDBDataSource.updateById(id, customerInput);
    const { ok } = update;
    if (!ok) throw Error('Update Error');
    const customer = await this.CustomerDBDataSource.getById(id);
    return { ...customer } as CustomerEntity
  }

  public async createLoginModel(customer: CustomerEntity): Promise<{ email: string, password: string }> {
    return { email: customer.email, password: decrypt(customer.password) }
  }
}
