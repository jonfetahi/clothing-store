import { HttpMethodEnum, ServiceDefinition } from "../types";
import ApiService from '../ApiService';

const baseUrl = (path = '') => ApiService.coreUrl('/orders' + path);

export const Orders: ServiceDefinition = {
  create: ({ payload }) => ({
    url: baseUrl(''),
    method: HttpMethodEnum.POST,
    payload,
  }),
  list: () => ({
    url: baseUrl('/my'),
    method: HttpMethodEnum.GET
  }),
  get: ({ id }) => ({
    url: baseUrl(`/my/${id}`),
    method: HttpMethodEnum.GET,
  }),
}