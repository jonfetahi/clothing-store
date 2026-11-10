import { useCallback, useEffect, useState } from 'react';
import { HttpMethodEnum } from '../api/types';
import { useApi } from '../context/api-context';

function useServices(service, autoload = false, initialArgs = {}) {
    const [loading, setLoading] = useState(autoload);
    const [response, setResponse] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { apiClient } = useApi();

    const request = useCallback(
        async (args = {}, formData = null, buffer = false) => {
            const {
                url,
                method = HttpMethodEnum.GET,
                params = {},
                payload = null,
                config = {},
            } = service({ ...initialArgs, ...args });
            const responseType = buffer ? 'arraybuffer' : 'json';
            const { search = '' } = args;
            const fullUrl = url + search;
            setLoading(true);
            let call;
            if (method === HttpMethodEnum.GET.valueOf()) {
                call = apiClient?.get(fullUrl, { ...config, responseType, params });
            } else if (method === HttpMethodEnum.POST.valueOf()) {
                call = apiClient?.post(fullUrl, formData ?? payload, {
                    ...config,
                    responseType,
                    params,
                });
            } else if (method === HttpMethodEnum.PUT.valueOf()) {
                call = apiClient.put(fullUrl, formData ?? payload, {
                    ...config,
                    responseType,
                    params,
                });
            } else if (method === HttpMethodEnum.DELETE.valueOf()) {
                call = apiClient.delete(
                    fullUrl,
                    { data: payload, params },
                    { ...config, responseType }
                );
            } else {
                throw Error(`Method ${method} does not exist`);
            }
            try {
                const response = await call;
                setResponse(response);
                setData(response.data);
                return Promise.resolve(response.data);
            } catch (e) {
                const errorMessage = e ?? `Error while Loading: ${url}`;
                setError(errorMessage);
                throw Error(errorMessage);

            } finally {
                setLoading(false);

            }
        },
        [service, initialArgs, apiClient]
    );

    const requestSync = useCallback((args, formData) => {
        request(args, formData).then(() => {});
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (autoload) {
            requestSync(initialArgs, null);
        }
    }, [autoload]);

    return {
        request: requestSync,
        requestAsync: request,
        loading,
        error,
        data,
        response,
    };
}

export default useServices;