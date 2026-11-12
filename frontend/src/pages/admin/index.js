import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminRoutes } from './routes';
import { useBreadcrumbs, useNavigation, usePageTitle } from '../../context/navigation-context';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Footer } from '../../shared/components/Footer';
import { VerticalMenu } from '../../shared/components/VerticalMenu';

function NavigationRouter({ routes }) {
  const indexRoute = routes.find((it) => it.index) || routes?.[0];
  usePageTitle('Admin Panel')
  useBreadcrumbs('Administration', 1)
  const { breadcrumbs } = useNavigation();

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-2 border-r">
        <VerticalMenu routes={AdminRoutes}/>
      </div>

      <div className="col-span-10 flex flex-col justify-between">
        <div>
          <div className="px-10 py-5 border-b">
            <ul className="flex flex-row items-center gap-2">
              {breadcrumbs.map((it, i) => {
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
            </ul>
          </div>
          <main>
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
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function Admin() {
  return (
    <NavigationRouter routes={AdminRoutes.filter((it) => it.component)} />
  )
}

export default Admin;