import { HttpMethodEnum, ServiceDefinition } from "../types";
import ApiService from '../ApiService';

const baseUrl = (path = '') => ApiService.coreUrl('/dashboard' + path);
export const Dashboard: ServiceDefinition = {
  summary: () => ({
    url: baseUrl('/summary'),
    method: HttpMethodEnum.GET,
  }),
  earnings: ({ period = "daily" }) => ({
    url: baseUrl(`/earnings`),
    method: HttpMethodEnum.GET,
    params: { period }
  }),
  topSelling: ({ limit = 5 }) => ({
    url: baseUrl('/top-selling-products'),
    method: HttpMethodEnum.GET,
    params: { limit }
  }),
  recentOrders: ({ limit = 5 }) => ({
    url: baseUrl('/recent-orders'),
    method: HttpMethodEnum.GET,
    params: { limit }
  })
}