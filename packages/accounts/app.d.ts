import { AxiosRequestConfig, AxiosResponseHeaders } from 'axios'

declare module 'axios' {
  export interface AxiosResponse<T = any, D = any>  {
    data: {
      data: T
      error?: string
      message?: string
    };
    status: number;
    statusText: string;
    headers: AxiosResponseHeaders;
    config: AxiosRequestConfig<D>;
    request?: any;
  }
}
