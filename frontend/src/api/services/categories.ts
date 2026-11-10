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
  testPost: ({ payload }) => ({
    url: baseUrl('/post'),
    method: HttpMethodEnum.POST,
    payload
  }),
  posts: () => ({
    url: baseUrl('/todos/1'),
    method: HttpMethodEnum.GET
  })
}