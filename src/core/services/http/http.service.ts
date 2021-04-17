import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class HttpService {

  constructor(
    protected httpClient: AxiosInstance,
    protected requestConfig: AxiosRequestConfig,
  ) { }

  async execute(): Promise<any> {
    return this.httpClient.request(this.requestConfig).then(dt => this.onSuccess(dt))
  }

  onSuccess(dt){
    this.HTTP_LOG({dt})
    return dt
  }

  onError(err) {
    this.HTTP_LOG({err})
    throw err;
  }

  HTTP_LOG({dt = null, err = null}){
    const { baseURL, url, params, method } = this.requestConfig
    
    if(dt){
      const { data } = dt
      console.log(`[HTTP][SUCCESS][${method.toLocaleUpperCase()}][${baseURL + url}][${params ? JSON.stringify(params) : ''}]: ${JSON.stringify(data)}`)
    }
    if(err){
      const { config, response, message } = err
      if (!config || !response) return console.log(`[HTTP][ERROR][${method.toLocaleUpperCase()}][${baseURL + url}][${params ? JSON.stringify(params) : ''}]:`, message)

      const { data } = response
      console.log(`[HTTP][ERROR][${method.toLocaleUpperCase()}][${baseURL + url}][${params ? JSON.stringify(params) : ''}]: ${JSON.stringify(data)}`)
    }
  }
}
