import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode
} from "react";

import { setAccessToken } from "../api/access-token";
import useServices from '../hooks/use-service';
import { Services } from '../api/services';

export type UserRole =
  | "Admin"
  | "Advanced User"
  | "Simple User";

export interface AuthUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (
    first_name: string,
    last_name: string,
    email: string,
    password: string
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingRestoreSession, setLoadingRestoreSession] = useState(true);

  const { loading: loadingLogin, requestAsync: loginRequest } =
    useServices(Services.Auth.login);

  const { loading: loadingRegister, requestAsync: registerRequest } =
    useServices(Services.Auth.register);

  const { loading: loadingRefresh, requestAsync: refreshRequest } =
    useServices(Services.Auth.refresh);

  const { loading: loadingLogout, requestAsync: logoutRequest } =
    useServices(Services.Auth.logout);

  // Restore the session after a browser refresh.
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const result: AuthResponse = await refreshRequest();

        if (active) {
          setAccessToken(result.token);
          setUser(result.user);
        }
      } catch {
        if (active) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoadingRestoreSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result: AuthResponse = await loginRequest({
        payload: { email, password }
      });

      setAccessToken(result.token);
      setUser(result.user);

      return result.user;
    },
    [loginRequest]
  );

  const register = useCallback(
    async (
      first_name: string,
      last_name: string,
      email: string,
      password: string
    ) => {
      const result: AuthResponse = await registerRequest({
        payload: {
          first_name,
          last_name,
          email,
          password
        }
      });

      setAccessToken(result.token);
      setUser(result.user);

      return result.user;
    },
    [registerRequest]
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, [logoutRequest]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loadingLogin || loadingLogout || loadingRestoreSession || loadingRefresh || loadingRegister,
        isAuthenticated: !!user,
        login,
        register,
        logout
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
