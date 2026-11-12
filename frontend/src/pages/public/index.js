import { Route, Routes, Navigate } from 'react-router-dom';
import { AllRoutes } from "./routes";
import { HorizontalMenu } from '../../shared/components/HorizontalMenu';
import { useNavigation, usePageTitle } from '../../context/navigation-context';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Footer } from '../../shared/components/Footer';
import { PublicDataProvider } from '../../context/public-context';

function NavigationRouter({ routes }) {
  const indexRoute = routes.find((it) => it.index) || routes?.[0];
  usePageTitle('ClothesStore')
  const { breadcrumbs } = useNavigation();
  return (
    <div className='bg-background'>
      <HorizontalMenu routes={routes.filter((it) => it.menu)} />
      <div className='px-10 py-5'>
        <div className="flex flex-row gap-2"> {breadcrumbs.map((it, i) => {
          const isLast = i === breadcrumbs.length - 1;

          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <FiChevronRight
                  size={13}
                  className="text-gray-300"
                />
              )}

              <span
                aria-current={isLast ? 'page' : undefined}
                className={`flex items-center gap-1.5 text-base transition-colors ${
                  isLast
                    ? 'font-semibold text-gray-900'
                    : 'font-medium text-gray-400'
                }`}
              >
            {i === 0 && <FiHome size={14} />}
                {it.name}
          </span>
            </li>
          );
        })}
        </div>
      </div>
      <Routes>
        {routes.map(({ path, component: Component, index }) => (
          <Route
            key={path || 'index'}
            path={index ? undefined : path}
            index={index}
            element={<Component />}
          />
        ))}
        {!routes.some((it) => it.index) && indexRoute && (
          <Route
            index
            element={<Navigate to={indexRoute.path} replace />}
          />
        )}
      </Routes>
      <Footer/>
    </div>
  );
}

function Public() {
  return (
    <PublicDataProvider>
      <NavigationRouter routes={AllRoutes.filter((it) => it.component)}/>
    </PublicDataProvider>
  )
}

export default Public;