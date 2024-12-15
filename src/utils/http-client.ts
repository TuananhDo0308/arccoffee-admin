import axios, { Method, AxiosResponse } from 'axios';
import apiLinks from './api-links';

interface Options {
  url: ((al: typeof apiLinks) => string) | string;
  data?: object | string;
  params?: object;
  contentType?: string;
  token?: string | null;
}

interface FullOptions extends Options {
  method: Method;
}

const request = (arg: FullOptions): Promise<AxiosResponse> => {
  const {
    method,
    contentType = 'application/json-patch+json',
    url,
    data,
    params,
    token,
  } = arg;

  return axios.request({
    method,
    headers: {
      'content-type': contentType,
      'Authorization': token,

    },
    url: typeof url === 'string' ? url : url(apiLinks),
    data,
    params,
  });
};

const httpClient = {
  request,
  get: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: 'GET' });
  },
  post: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: 'POST' });
  },
  put: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: 'PUT' });
  },
  delete: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: 'DELETE' });
  },
};

export default httpClient;
