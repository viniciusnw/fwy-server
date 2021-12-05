import { Inject, Container } from 'typedi';
import { ENV_NAMES } from 'core/constants';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
const util = require('util');
class httpService {

  constructor(
    protected httpClient: AxiosInstance,
    protected requestConfig: AxiosRequestConfig,
    protected DEV: Boolean,
  ) { }

  async execute(): Promise<any> {
    return this.httpClient.request(this.requestConfig).then(response => this.onSuccess(response))
  }

  onSuccess(response) {
    if (this.DEV) this.HTTP_LOG({ response })
    return response;
  }

  onError(err) {
    if (this.DEV) this.HTTP_LOG({ err })
    throw err;
  }

  HTTP_LOG({ response = null, err = null }) {
    const { baseURL, url, params, method, headers, auth } = this.requestConfig

    if (response) {
      const { data } = response
      console.log(`[HTTP][SUCCESS]:`, util.inspect(
        {
          method: method.toLocaleUpperCase(),
          headers,
          auth,
          url: baseURL + url,
          params,
          data
        },
        false, null, true)
      );
    }
    if (err) {
      const { response = { data: '' }, message } = err
      const { data } = response;
      console.log(`[HTTP][ERROR]:`, util.inspect(
        {
          method: method.toLocaleUpperCase(),
          headers,
          auth,
          url: baseURL + url,
          params,
          data,
          message
        },
        false, null, true)
      );
    }
  }
}

export class HttpService extends httpService {
  constructor(
    httpClient: AxiosInstance,
    requestConfig: AxiosRequestConfig
  ) {
    super(httpClient, requestConfig, Container.get(ENV_NAMES.DEV))
  }

  async execute(): Promise<any> {
    try {
      const response = await super.execute();
      return response.data;
    } catch (error) {
      this.onError(error);
    }
  }
}