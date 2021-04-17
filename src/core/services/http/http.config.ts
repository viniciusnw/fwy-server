import axios, { AxiosProxyConfig } from 'axios';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { forEach, merge } from 'lodash';
import { HttpService } from '.';

const USE_OUTBOUND_PROXY = process.env.USE_OUTBOUND_PROXY === 'true';
const OUTBOUND_PROXY_HOST = process.env.OUTBOUND_PROXY_HOST;
const OUTBOUND_PROXY_PORT = +process.env.OUTBOUND_PROXY_PORT;
const OUTBOUND_PROXY_USER = process.env.OUTBOUND_PROXY_USER;
const OUTBOUND_PROXY_PASSWORD = process.env.OUTBOUND_PROXY_PASSWORD;

export interface HttpServiceBuilder {
  get(url: string): HttpServiceBuilder;
  delete(url: string): HttpServiceBuilder;
  head(url: string): HttpServiceBuilder;
  post(url: string): HttpServiceBuilder;
  put(url: string): HttpServiceBuilder;
  patch(url: string): HttpServiceBuilder;
}

export class HttpServiceBuilder {

  protected httpClient: AxiosInstance;
  protected requestConfig: AxiosRequestConfig;

  constructor(
    baseURL: string,
    headers?: Object,
    timeout?: number
  ) {

    timeout = timeout || 120000;
    headers = headers || {};
    let proxy: AxiosProxyConfig;
    if (USE_OUTBOUND_PROXY) {
      proxy = {
        host: OUTBOUND_PROXY_HOST,
        port: OUTBOUND_PROXY_PORT,
        auth: {
          username: OUTBOUND_PROXY_USER,
          password: OUTBOUND_PROXY_PASSWORD,
        },
      };
    }
    this.requestConfig = { baseURL, timeout, headers, proxy };
    this.httpClient = axios.create({ baseURL, timeout, headers, proxy });
  }

  clone(): HttpServiceBuilder {
    throw new Error();
  }

  authorization(token: string): HttpServiceBuilder {
    this.requestConfig.headers['Authorization'] = token;
    return this;
  }

  headers(headers: Object): HttpServiceBuilder {
    merge(this.requestConfig.headers, headers);
    return this;
  }

  data(data: any): HttpServiceBuilder {
    this.requestConfig.data = data;
    return this;
  }

  baseUrl(data: any): HttpServiceBuilder {
    this.requestConfig.baseURL = data;
    return this;
  }

  params(params: any): HttpServiceBuilder {
    this.requestConfig.params = params;
    return this;
  }

  timeout(timeout: number): HttpServiceBuilder {
    this.requestConfig.timeout = timeout;
    return this;
  }

  auth(username: string, password: string): HttpServiceBuilder {
    this.requestConfig.auth = { username, password };
    return this;
  }

  build(): HttpService {
    return new HttpService(this.httpClient, this.requestConfig);
  }
}

forEach(['get', 'delete', 'head', 'post', 'put', 'patch'], (method) => {
  HttpServiceBuilder.prototype[method] = function (url): HttpServiceBuilder {
    const newInstance = this.clone();
    newInstance.requestConfig.method = method;
    newInstance.requestConfig.url = url;
    return newInstance;
  };
});
