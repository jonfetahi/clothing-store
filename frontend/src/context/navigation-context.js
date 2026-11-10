import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const INITIAL_BREADCRUMBS = [
  {
    name: 'Home',
    level: 1,
    action: () => {},
  },
];

const INITIAL_DATA = {
  setBreadcrumbs: () => {},
  setBreadcrumb: (name, action, level) => console.log({ name, action, level }),
  breadcrumbs: INITIAL_BREADCRUMBS,
  setIsFixed: () => {},
};

const NavigationContext = createContext(INITIAL_DATA);

export function useNavigation() {
  return useContext(NavigationContext);
}

export function useBreadcrumbs(name, level, action = undefined) {
  const { setBreadcrumb, setBreadcrumbs } = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumb(name, level, action ?? (() => navigate(location.pathname)));
    return () => setBreadcrumbs((breadcrumbs) => breadcrumbs.slice(0, level));
  }, [level, name]);
}

export function usePageTitle(title) {
  const [oldTitle] = useState(document.title);
  useEffect(() => {
    document.title = title;
    return () => (document.title = oldTitle);
  }, [oldTitle, title]);
}

export function NavigationProvider({ children }) {
  const value = useNavigationProvider();
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationProvider() {
  const [isFixed, setIsFixed] = useState(false);

  const [breadcrumbs, setBreadcrumbs] = useState([
    {
      name: 'Home',
      level: 1,
      action: () => {},
    },
  ]);

  const setBreadcrumb = useCallback((name, level, action) => {
    const item = { name, action };
    setBreadcrumbs((breadcrumbs) => {
      if (!name && breadcrumbs.length > level) {
        breadcrumbs[level].name = '';
      } else if (breadcrumbs.length <= level) {
        while (breadcrumbs.length < level) {
          breadcrumbs.push({ name: '' });
        }
        breadcrumbs.push(item);
      } else {
        breadcrumbs[level] = item;
      }
      return [...breadcrumbs];
    });
  }, []);

  return {
    breadcrumbs,
    setBreadcrumbs,
    setBreadcrumb,
    isFixed,
    setIsFixed,
  };
}