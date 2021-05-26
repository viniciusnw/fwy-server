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
    if (!emailAdded) throw Error("Error in add Email");
    return true
  }
}
