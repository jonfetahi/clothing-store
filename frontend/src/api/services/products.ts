import { HttpMethodEnum, ServiceDefinition } from "../types";
import ApiService from '../ApiService';

const baseUrl = (path = '') => ApiService.coreUrl('/products' + path);

export const Products: ServiceDefinition = {
  list: () => ({
    url: baseUrl(''),
    method: HttpMethodEnum.GET,
  }),
  get: ({ id }) => ({
    url: baseUrl(`/${id}`),
    method: HttpMethodEnum.GET,
  }),
  create: ({ payload }) => ({
    url: baseUrl(''),
    method: HttpMethodEnum.POST,
    payload
  }),
  update: ({ id, payload }) => ({
    url: baseUrl(`/${id}`),
    method: HttpMethodEnum.PUT,
    payload
  }),
  delete: ({ id }) => ({
    url: baseUrl(`/${id}`),
    method: HttpMethodEnum.DELETE
  }),
  search: ({ search }) =>({
    url: baseUrl(``),
    method: HttpMethodEnum.GET,
    params: {
      search
    }
  })
}