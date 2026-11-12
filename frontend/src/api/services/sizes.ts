import { HttpMethodEnum, ServiceDefinition } from "../types";
import ApiService from '../ApiService';

const baseUrl = (path = '') => ApiService.coreUrl('/sizes' + path);
export const Sizes: ServiceDefinition = {
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
  update: ({ payload, id }) => ({
    url: baseUrl(`/${id}`),
    method: HttpMethodEnum.PUT,
    payload
  }),
  delete: ({ id }) => ({
    url: baseUrl(`/${id}`),
    method: HttpMethodEnum.DELETE,
  })
}