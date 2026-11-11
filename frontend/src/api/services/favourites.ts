import { HttpMethodEnum, ServiceDefinition } from '../types';

const baseUrl = (path = '') => `http://localhost:5000/api` + path;

export const Favourites: ServiceDefinition = {
  list:() => ({
    url: baseUrl('/favourites'),
    method: HttpMethodEnum.GET
  }),
  get:({ id }) => ({
    url: baseUrl(`/favourites/${id}`),
    method: HttpMethodEnum.GET
  }),
  add:({ payload }) => ({
    url: baseUrl(`/favourites`),
    method: HttpMethodEnum.POST,
    payload,
  }),
  update:({ payload, id }) => ({
    url: baseUrl(`/favourites/${id}`),
    method: HttpMethodEnum.PUT,
    payload,
  }),
  delete: ({ id }) => ({
    url: baseUrl(`/favourites/${id}`),
    method: HttpMethodEnum.DELETE,
  })
}