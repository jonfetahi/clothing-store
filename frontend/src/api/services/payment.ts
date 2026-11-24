import { HttpMethodEnum, ServiceDefinition } from "../types";
import ApiService from '../ApiService';

const baseUrl = (path = '') => ApiService.coreUrl('/payments' + path);

export const Payment: ServiceDefinition = {
  simulate: ({ payload }) => ({
    url: baseUrl('/simulate'),
    method: HttpMethodEnum.POST,
    payload
  }),
}