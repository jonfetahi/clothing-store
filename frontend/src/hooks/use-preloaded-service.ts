import useService from './use-service';

export function usePreloadedService(serviceMapping: any) {
  const preloaded: [string, { loading: boolean; data: any }][] = Object.entries(
    serviceMapping ?? {}
  ).map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ([key, service]) => [key, useService(service, true)]
  );

  const loading = preloaded.some(([, service]) => service.loading);
  const value = preloaded.reduce(
    (prev, [key, service]) => ({ ...prev, [key]: service.data }),
    {}
  );

  return { loading, value };
}