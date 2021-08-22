import { GraphQLContext } from 'resolvers/graphql.context';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware } from 'core/middlewares';

// REPOS
import { AuthRepository, CustomerRepository, GeneralRepository } from 'data/repositories'
// INPUT TYPES
import { CustomerRegisterInput } from './types/customer-register.input';
import { CustomerUpdateInput } from './types/customer-update.input';
import { Pagination } from 'resolvers/General/types/pagination.input'
import { NextPagination } from 'resolvers/General/types/next-pagination.input'
// OBJ TYPES
import { CustomerList } from './types/customer-list.object-type';
import { CustomerRegister } from './types/customer-register.object-type';
import { CustomerUpdate } from './types/customer-update.object-type';
import { CustomerLogin } from './types/customer-login.object-type';
import { Customer } from 'resolvers/Customer/types/customer.object-type'

@Resolver()
export class CustomerGraphQLResolver {

  constructor(
    private AuthRepository: AuthRepository,
    private CustomerRepository: CustomerRepository,
  ) { }

  @Mutation(returns => CustomerRegister)
  async customerRegister(
    @Arg('customer') customerInput: CustomerRegisterInput,
  ): Promise<CustomerRegister> {

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
    @Arg('isAdmin', { nullable: true }) isAdmin: boolean,
  ): Promise<CustomerLogin> {

    const customer = await this.CustomerRepository.login(email, password, isAdmin)
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

  @UseMiddleware(AuthenticationGraphQLMiddleware, TokenGraphQLMiddleware)
  @Query(returns => CustomerList)
  async listCustomers(
    @Ctx() context: GraphQLContext,
    @Arg('pagination') pagination: Pagination,
    @Arg('term', { nullable: true }) term: string,
  ): Promise<CustomerList> {

    let listCustomers = []
    if (term) listCustomers = await this.CustomerRepository.search(term, pagination);
    else listCustomers = await this.CustomerRepository.listCustomers(pagination);

    const hasNextPage = listCustomers.length == pagination.nPerPage;
    const nextPagination = {
      ...pagination,
      nextPageNumber: hasNextPage ? pagination.pageNumber + 1 : null
    } as NextPagination;

    const customers = listCustomers.map(customer => ({
      ...customer.toObject(),
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
    return {
      ...customer,
      avatar: this.CustomerRepository.createAvatarObjectType(customer)
    } as Customer
  }
}
