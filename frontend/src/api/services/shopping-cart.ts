import { HttpMethodEnum, ServiceDefinition } from '../types';

const baseUrl = (path = '') => `http://localhost:5000/api` + path;


export const ShoppingCart: ServiceDefinition = {
  list: () => ({
    url: baseUrl('/shopping-cart'),
    method: HttpMethodEnum.GET
  }),
  get: ({ id }) => ({
    url: baseUrl(`/shopping-cart/${id}`),
    method: HttpMethodEnum.GET,
  }),
  add: ({ payload }) => ({
    url: baseUrl(`/shopping-cart`),
    method: HttpMethodEnum.POST,
    payload
  }),
  update: ({ payload, id }) => ({
    url: baseUrl(`/shopping-cart/${id}`),
    method: HttpMethodEnum.PUT,
    payload
  }),
  delete: ({ id }) => ({
    url: baseUrl(`/shopping-cart/${id}`),
    method: HttpMethodEnum.DELETE,
  })
}