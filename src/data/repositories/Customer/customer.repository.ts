import { Service } from "typedi";
import { encrypt, decrypt } from "core/services";
import { MongoDataSource, JSONDataSource } from "data/datasource";
import { CustomerEntity, AvatarEntity } from "data/datasource/mongo/models";

// INPUT TYPES
import { CustomerRegisterInput } from "resolvers/Customer/types/customer-register.input";
import { CustomerUpdateInput } from "resolvers/Customer/types/customer-update.input";
import { Avatar } from "resolvers/Customer/types/customer.object-type";

type CreateLoginModel = {
  email: string;
  password: string;
};

@Service()
export class CustomerRepository {
  constructor(
    private CustomerDBDataSource: MongoDataSource.CustomerDBDataSource
  ) { }

  public async create(customerInput: CustomerRegisterInput): Promise<CustomerEntity> {
    const customer = await this.CustomerDBDataSource.getByEmail(customerInput.email);
    if (customer) throw Error("e-mail already exists");
    customerInput.password = encrypt(customerInput.password);
    const avatar = this.createAvatarBufferEntity(customerInput);
    const createdCustomer = await this.CustomerDBDataSource.create({
      ...customerInput,
      avatar,
    } as CustomerEntity);
    return createdCustomer.toObject();
  }

  public async login(email: string, password: string): Promise<CustomerEntity> {
    const customer = await this.CustomerDBDataSource.getByEmailAndPass(email, encrypt(password));
    if (!customer) throw Error("Invalid email or password");
    return customer.toObject();
  }

  public async update(id: string, customerInput: CustomerUpdateInput): Promise<CustomerEntity> {
    const avatar = this.createAvatarBufferEntity(customerInput);
    const update = await this.CustomerDBDataSource.updateById(id, {
      ...customerInput,
      avatar,
    } as CustomerEntity);
    const { ok } = update;
    if (!ok) throw Error("Update Error");
    const customer = await this.CustomerDBDataSource.getById(id);
    return { ...customer } as CustomerEntity;
  }

  public createLoginModel(customer: CustomerEntity): CreateLoginModel {
    return { email: customer.email, password: decrypt(customer.password) };
  }

  private createAvatarBufferEntity(customerInput: CustomerRegisterInput): AvatarEntity {
    let avatar = null;
    if (customerInput.avatar) {
      avatar = {
        data: Buffer.from(customerInput.avatar.data, "base64"),
        type: customerInput.avatar.type,
      };
    }
    return avatar;
  }

  public createAvatarObjectType(customer: CustomerEntity): Avatar {
    let avatar = null;
    if (customer.avatar) {
      avatar = {
        type: customer.avatar.type,
        data: customer.avatar.data.toString('base64'),
      };
    }
    return avatar;
  }
}
