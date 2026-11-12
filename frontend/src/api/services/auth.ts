import { HttpMethodEnum, ServiceDefinition } from "../types";
import ApiService from '../ApiService';

const baseUrl = (path = '') => ApiService.coreUrl('/auth' + path);

export const Auth: ServiceDefinition = {
  register: ({ payload }) => ({
    url: baseUrl('/register'),
    method: HttpMethodEnum.POST,
    payload: payload,
  }),
  login: ({ payload }) => ({
    url: baseUrl('/login'),
    method: HttpMethodEnum.POST,
    payload: payload,
  }),
  logout: ({ payload }) => ({
    url: baseUrl('/logout'),
    method: HttpMethodEnum.POST,
    payload: payload,
  }),
  me: () => ({
    url: baseUrl('/me'),
    method: HttpMethodEnum.GET,
  }),
  refresh: () => ({
    url: baseUrl('/refresh'),
    method: HttpMethodEnum.POST,
  })
}