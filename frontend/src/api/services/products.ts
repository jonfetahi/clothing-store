import { HttpMethodEnum, ServiceDefinition } from "../types";

const baseUrl = (path = '') => `http://localhost:5000/api` + path;

export const Products: ServiceDefinition = {
  list: () => ({
    url: baseUrl('/products'),
    method: HttpMethodEnum.GET,
  }),
  get: ({ id }) => ({
    url: baseUrl(`/products/${id}`),
    method: HttpMethodEnum.GET,
  }),
  create: ({ payload }) => ({
    url: baseUrl('/products'),
    method: HttpMethodEnum.POST,
    payload
  }),
  update: ({ id, payload }) => ({
    url: baseUrl(`/products/${id}`),
    method: HttpMethodEnum.PUT,
    payload
  }),
  delete: ({ id }) => ({
    url: baseUrl(`/products/${id}`),
    method: HttpMethodEnum.DELETE
  })
}