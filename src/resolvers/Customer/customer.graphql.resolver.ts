import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { AuthRepository, CustomerRepository, GeneralRepository } from 'data/repositories'
// INPUT TYPES
import { CustomerRegisterInput } from './types/customer-register.input';
import { CustomerUpdateInput } from './types/customer-update.input';
// OBJ TYPES
import { CustomerRegister } from './types/customer-register.object-type';
import { CustomerUpdate } from './types/customer-update.object-type';
import { CustomerLogin } from './types/customer-login.object-type';
import { Customer } from 'resolvers/Customer/types/customer.object-type'

@Resolver()
export class CustomerGraphQLResolver {

  constructor(
    private AuthRepository: AuthRepository,
    private CustomerRepository: CustomerRepository,
    private GeneralRepository: GeneralRepository
  ) { }

  @Mutation(returns => CustomerRegister)
  async customerRegister(
    @Arg('customer') customerInput: CustomerRegisterInput,
  ): Promise<CustomerRegister> {

    // const inWhiteList = await this.GeneralRepository.emailInWhiteList(customerInput.email);
    // if (!inWhiteList) return

    const createdCustomer = await this.CustomerRepository.create(customerInput);
    const login = { email: customerInput.email, password: customerInput.password };
    const retoken = await this.AuthRepository.createReToken(login);
    const token = await this.AuthRepository.createCustomerToken(createdCustomer, retoken);

    const avatar = this.CustomerRepository.createAvatarObjectType(createdCustomer)
    const Customer = { ...createdCustomer, avatar } as Customer

    return {
      ...Customer,
      token,
      role: 'Customer',
      expirationTime: 86400000,
    } as CustomerRegister;
  }

  @Mutation(returns => CustomerLogin)
  async customerLogin(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<CustomerLogin> {

    const customer = await this.CustomerRepository.login(email, password)
    const retoken = await this.AuthRepository.createReToken({ email, password });
    const token = await this.AuthRepository.createCustomerToken(customer, retoken);

    const avatar = this.CustomerRepository.createAvatarObjectType(customer)
    const Customer = { ...customer, avatar } as Customer

    return {
      ...Customer,
      token,
      role: 'Customer',
      expirationTime: 86400000,
    } as CustomerLogin;
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => CustomerUpdate)
  async customerUpdate(
    @Ctx() context: GraphQLContext,
    @Arg('customer') customerInput: CustomerUpdateInput,
  ): Promise<CustomerUpdate> {

    const { token: { client: { _id } } } = context
    const customer = await this.CustomerRepository.update(_id, customerInput)
    const login = this.CustomerRepository.createLoginModel(customer);
    const retoken = await this.AuthRepository.createReToken(login);
    const token = await this.AuthRepository.createCustomerToken(customer, retoken);

    const avatar = this.CustomerRepository.createAvatarObjectType(customer)
    const Customer = { ...customer, avatar } as Customer

    return {
      ...Customer,
      token,
      role: 'Customer',
      expirationTime: 86400000,
    } as CustomerUpdate;
  }
}
