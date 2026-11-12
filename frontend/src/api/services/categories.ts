import { HttpMethodEnum, ServiceDefinition } from "../types";

const baseUrl = (path = '') => `http://localhost:5000/api` + path;

export const Categories: ServiceDefinition = {
  list: () => ({
    url: baseUrl('/categories'),
    method: HttpMethodEnum.GET,
  }),
  get: ({ id }) => ({
    url: baseUrl(`/categories/${id}`),
    method: HttpMethodEnum.GET,
  }),
  create: ({ payload }) => ({
    url: baseUrl('/categories'),
    method: HttpMethodEnum.POST,
    payload
  }),
  update: ({ payload, id }) => ({
    url: baseUrl(`/categories/${id}`),
    method: HttpMethodEnum.PUT,
    payload
  }),
  delete: ({ id }) => ({
    url: baseUrl(`/categories/${id}`),
    method: HttpMethodEnum.DELETE,
  })
}