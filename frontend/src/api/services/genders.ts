import { HttpMethodEnum, ServiceDefinition } from "../types";
import ApiService from '../ApiService';

const baseUrl = (path = '') => ApiService.coreUrl('/genders' + path);

export const Genders: ServiceDefinition = {
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