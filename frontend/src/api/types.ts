export enum HttpMethodEnum {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type EndpointQueryParams = {
  [key: string]: number | boolean | string | null;
};

export type EndpointDefinition = (config: { [key: string]: any }) => {
  url: string;
  method?: HttpMethodEnum;
  params?: EndpointQueryParams;
  payload?: any;
};

export type ServiceDefinition = {
  [key: string]: EndpointDefinition;
}