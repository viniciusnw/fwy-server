import { Inject, Service } from 'typedi';
import { ENV_NAMES } from 'core/constants';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpService, HttpServiceBuilder } from 'core/services';

class RestService extends HttpService {
  constructor(
    httpClient: AxiosInstance,
    requestConfig: AxiosRequestConfig,
  ) { super(httpClient, requestConfig) }

  async execute(): Promise<any> {
    try {
      const response = await super.execute();
      return response.data;
    } catch (error) {
      this.onError(error);
    }
  }
}

@Service()
export class RestApiBuilder extends HttpServiceBuilder {

  constructor(
    @Inject(ENV_NAMES.REST_API) private REST_API,
  ) {
    super(
      REST_API.URL,
      { 'Content-Type': 'application/json' },
      30000,
    );
  }

  clone(): RestApiBuilder {
    return new RestApiBuilder(
      this.REST_API.URL,
    );
  }

  build(): HttpService {
    return new RestService(
      this.httpClient,
      this.requestConfig,
    );
  }

}
