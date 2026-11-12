import { useContext, useMemo, createContext } from "react";
import axios from "axios";
import { useNotify } from '../hooks/use-notify';
import ApiService from '../api/ApiService';
import { getAccessToken, setAccessToken } from '../api/access-token';

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
  let accessToken = null

  const apiClient = useMemo(() => {
    const client = axios.create({
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });

    const refreshClient = axios.create({
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    });

    let refreshPromise = null;

    const refreshAccessToken = async () => {
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post(
          ApiService.coreUrl("/auth/refresh")
        )
          .then(({ data }) => {
            setAccessToken(data.token);
            return data.token;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise;
    };

    // REQUEST INTERCEPTOR
    client.interceptors.request.use(
      (config) => {
        const token = getAccessToken();

        if (token) {
          config.headers.set(
            "Authorization",
            `Bearer ${token}`
          );
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        const status = error.response?.status;

        const isAuthEndpoint =
          originalRequest?.url?.includes("/auth/login") ||
          originalRequest?.url?.includes("/auth/register") ||
          originalRequest?.url?.includes("/auth/refresh") ||
          originalRequest?.url?.includes("/auth/logout");

        // Attempt to refresh an expired access token.
        if (
          status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
          originalRequest._retry = true;

          try {
            const token = await refreshAccessToken();

            originalRequest.headers.set(
              "Authorization",
              `Bearer ${token}`
            );

            return client(originalRequest);
          } catch {
            setAccessToken(null);

            return Promise.reject(error);
          }
        }

        // Centralized error notifications.
        if (!error.response || status === undefined || status >= 500) {
          showError("The system is currently unavailable. Please try again later.");
        } else if (status === 403) {
          showError("You don't have permission to perform this action.");
        } else if (status === 401 && !isAuthEndpoint) {
          showError("Please log in again.");
        }

        return Promise.reject(error);
      }
    );

    return client;
  }, []);


  return { apiClient };
}