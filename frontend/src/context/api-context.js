import { useContext, useMemo, createContext } from "react";
import axios from "axios";
import { useNotify } from '../hooks/use-notify';

const INITIAL_DATA = {
  apiClient: (service) => console.log(service),
  activeError: null,
}

const ApiContext = createContext(INITIAL_DATA)

export function useApi() {
  return useContext(ApiContext)
}

export function ApiProvider({children}) {
  const value = useProvideApi();
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

function useProvideApi() {
  const { showError } = useNotify()

  const apiClient = useMemo(() => {

    const client = axios.create({
      withCredentials: false,
      headers: {
        Accept: "application/json",
        }
    });

    client.interceptors.request.use(
      (config) => {
        return config;
      }, (error) => {
        if (!error.response || error.response.status >= 500) {
          const message = 'The system is currently not available. Please try again later.';
          showError({
            title: 'System Unavailable',
            message,
            duration: 10000,
          })
          return Promise.reject(message);
        } else if (error.response.status === 401 || error.response.status === 403) {
          const message = "Could not load data because you don't have the necessary permission.";
          showError({
            title: 'You are not Authorized',
            message,
            duration: 10000,
          })
        } else {
          return Promise.reject(error.response.status);
        }
      }
    )

    client.interceptors.response.use(
      (response) => {
        return response;
      }, (error) => {
        return Promise.reject(error);
      })

    return client;
  }, []);


  return { apiClient };
}