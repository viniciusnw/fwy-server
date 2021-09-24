import { Service } from 'typedi';
import { JSONDataSource, MongoDataSource } from 'data/datasource';
import { WhiteListItemEntity } from "data/datasource/mongo/models";


@Service()
export class GeneralRepository {

  constructor(
    private WhiteListDBDataSource: MongoDataSource.WhiteListDBDataSource,
    private CountriesJSONDataSource: JSONDataSource.CountriesJSONDataSource,
  ) { }

  public countries(): Promise<String[]> {
    return this.CountriesJSONDataSource.getCountries()
  }

  public states(country: string): Promise<String[]> {
    return this.CountriesJSONDataSource.getStates(country)
  }

  public async addItemWhiteList(email: string): Promise<boolean> {
    const emailAdded = await this.WhiteListDBDataSource.create({ email } as WhiteListItemEntity);
    if (!emailAdded) throw Error("error in add email");
    return true
  }

  public async emailInWhiteList(email: string): Promise<boolean> {
    const inList = await this.WhiteListDBDataSource.getByEmail(email);
    if (!inList) throw Error("email not authorized");
    return true
  }
}
