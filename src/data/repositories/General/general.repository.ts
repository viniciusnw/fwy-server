import { Service } from 'typedi';
import { JSONDataSource } from 'data/datasource';


@Service()
export class GeneralRepository {

  constructor(
    private CountriesJSONDataSource: JSONDataSource.CountriesJSONDataSource
  ) { }

  public countries(): Promise<String[]> {
    return this.CountriesJSONDataSource.getCountries()
  }

  public states(country: string): Promise<String[]> {
    return this.CountriesJSONDataSource.getStates(country)
  }
}
