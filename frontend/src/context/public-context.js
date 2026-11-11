import { createContext, useContext, useMemo } from 'react';
import { usePreloadedService } from '../hooks/use-preloaded-service';
import { Services } from '../api/services';

const INITIAL_DATA = {};

const PRELOADED_SERVICES = {
  me: Services.Auth.me,
};

const PublicDataContext = createContext(INITIAL_DATA);

export function usePublicData() {
  return useContext(PublicDataContext);
}

export function PublicDataProvider({ children }) {
  const value = useProvideAirlinesData();
  return (
    <PublicDataContext.Provider value={value}>
      {children}
    </PublicDataContext.Provider>
  );
}

function useProvideAirlinesData() {
  const { value } = usePreloadedService(PRELOADED_SERVICES);


  return {
    ...value,
  };
}