import { Inject, Container } from 'typedi';
import { ENV_NAMES } from 'core/constants';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
class httpService {

  constructor(
    protected httpClient: AxiosInstance,
    protected requestConfig: AxiosRequestConfig,
    protected DEV: Boolean,
  ) { }

  async execute(): Promise<any> {
    return this.httpClient.request(this.requestConfig).then(dt => this.onSuccess(dt))
  }

  onSuccess(dt) {
    if(this.DEV) this.HTTP_LOG({ dt })
    return dt;
  }

  onError(err) {
    if(this.DEV) this.HTTP_LOG({ err })
    throw err;
  }

  HTTP_LOG({ dt = null, err = null }) {
    const { baseURL, url, params, method } = this.requestConfig

    if (dt) {
      const { data } = dt
      console.log(`[HTTP][SUCCESS][${method.toLocaleUpperCase()}][${baseURL + url}][${params ? JSON.stringify(params) : ''}]: ${JSON.stringify(data)}`)
    }
    if (err) {
      const { config, response, message } = err
      if (!config || !response) return console.log(`[HTTP][ERROR][${method.toLocaleUpperCase()}][${baseURL + url}][${params ? JSON.stringify(params) : ''}]:`, message)

      const { data } = response
      console.log(`[HTTP][ERROR][${method.toLocaleUpperCase()}][${baseURL + url}][${params ? JSON.stringify(params) : ''}]: ${JSON.stringify(data)}`)
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