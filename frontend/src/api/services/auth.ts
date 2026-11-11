import { HttpMethodEnum, ServiceDefinition } from "../types";

const baseUrl = (path = '') => `http://localhost:5000/api` + path;

export const Auth: ServiceDefinition = {
  register: ({ payload }) => ({
    url: baseUrl('/auth/register'),
    method: HttpMethodEnum.POST,
    payload: payload,
  }),
  login: ({ payload }) => ({
    url: baseUrl('/auth/login'),
    method: HttpMethodEnum.POST,
    payload: payload,
  }),
  me: () => ({
    url: baseUrl('/auth/me'),
    method: HttpMethodEnum.GET,
  })
}