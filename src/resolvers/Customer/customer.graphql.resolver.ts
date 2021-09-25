import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { AuthRepository, CustomerRepository } from 'data/repositories'
// INPUT TYPES
import { CustomerRegisterInput } from './types/customer-register.input';
import { CustomerUpdateInput } from './types/customer-update.input';
import { Pagination } from 'resolvers/General/types/pagination.input'
import { NextPagination } from 'resolvers/General/types/next-pagination.object-type'
import { CustomerConfigsInput } from './types/customer-configs.input'
import { CustomerConfigs } from './types/customer-configs.object-type'
// OBJ TYPES
import { CustomerList } from './types/customer-list.object-type';
import { CustomerRegister } from './types/customer-register.object-type';
import { CustomerUpdate } from './types/customer-update.object-type';
import { CustomerLogin } from './types/customer-login.object-type';
import { Customer } from 'resolvers/Customer/types/customer.object-type'
import { CustomerEntity } from 'data/datasource/mongo/models';

@Resolver()
export class CustomerGraphQLResolver {

  constructor(
    private AuthRepository: AuthRepository,
    private CustomerRepository: CustomerRepository,
  ) { }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Mutation(returns => CustomerConfigs)
  async setCustomerConfigs(
    @Ctx() context: GraphQLContext,
    @Arg('customerId', { nullable: true }) customerId: string,
    @Arg('configs', { nullable: true }) configs: CustomerConfigsInput,
  ): Promise<CustomerConfigs> {
    const { token: { client: { _id } } } = context
    let customerConfigs = await this.CustomerRepository
      .setCustomerConfigs(customerId || _id, configs);
    return customerConfigs as CustomerConfigs
  }

  @Mutation(returns => CustomerRegister)
  async customerRegister(
    @Arg('customer') customerInput: CustomerRegisterInput,
    @Arg('configs', { nullable: true }) configs: CustomerConfigsInput,
  ): Promise<CustomerRegister> {

    const createdCustomer = await this.CustomerRepository.create(customerInput);
    const login = { email: customerInput.email, password: customerInput.password };
    const retoken = await this.AuthRepository.createReToken(login);
    const token = await this.AuthRepository.createCustomerToken(createdCustomer, retoken);

    const avatar = this.CustomerRepository.createAvatarObjectType(createdCustomer)
    let customerConfigs = await this.CustomerRepository
      .setCustomerConfigs(createdCustomer._id, configs)

    const Customer = {
      ...createdCustomer,
      configs: customerConfigs,
      avatar
    } as Customer

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
    @Arg('isAdmin', { nullable: true }) isAdmin: boolean,
  ): Promise<CustomerLogin> {

    const customer = await this.CustomerRepository.login(email, password, isAdmin)
    const retoken = await this.AuthRepository.createReToken({ email, password });
    const token = await this.AuthRepository.createCustomerToken(customer, retoken);

    const avatar = this.CustomerRepository.createAvatarObjectType(customer)
    let customerConfigs = await this.CustomerRepository
      .getCustomerConfigs(customer._id)

    const Customer = {
      ...customer,
      configs: customerConfigs,
      avatar
    } as Customer

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
    @Arg('customer', { nullable: true }) customerInput: CustomerUpdateInput,
  ): Promise<CustomerUpdate> {

    const { token: { client: { _id } } } = context
    const customer = await this.CustomerRepository.update(_id, customerInput)
    const login = this.CustomerRepository.createLoginModel(customer);
    const retoken = await this.AuthRepository.createReToken(login);
    const token = await this.AuthRepository.createCustomerToken(customer, retoken);

    const avatar = this.CustomerRepository.createAvatarObjectType(customer)
    let customerConfigs = await this.CustomerRepository
      .getCustomerConfigs(customer._id)

    const Customer = {
      ...customer,
      configs: customerConfigs,
      avatar
    } as Customer

    return {
      ...Customer,
      token,
      role: 'Customer',
      expirationTime: 86400000,
    } as CustomerUpdate;
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Query(returns => CustomerList)
  async listCustomers(
    @Ctx() context: GraphQLContext,
    @Arg('pagination') pagination: Pagination,
    @Arg('term', { nullable: true }) term: string,
  ): Promise<CustomerList> {

    const listCustomers = await this.CustomerRepository.listOrSearchCustomers(context.token, term, pagination)

    const hasNextPage = listCustomers.length == pagination.nPerPage;
    const nextPagination = {
      ...pagination,
      nextPageNumber: hasNextPage ? pagination.pageNumber + 1 : null
    } as NextPagination;

    const customers = listCustomers.map(customer => ({
      ...customer.toObject(),
      configs: null,
      avatar: this.CustomerRepository.createAvatarObjectType(customer)
    }))

    return {
      customers,
      nextPagination
    } as CustomerList
  }

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Query(returns => Customer)
  async getCustomer(
    @Ctx() context: GraphQLContext,
    @Arg('customerId') id: string,
  ): Promise<Customer> {
    const customer = await this.CustomerRepository.getById(id)
    let customerConfigs = await this.CustomerRepository
      .getCustomerConfigs(customer._id)
    return {
      ...customer,
      configs: customerConfigs,
      avatar: this.CustomerRepository.createAvatarObjectType(customer)
    } as Customer
  }
}
