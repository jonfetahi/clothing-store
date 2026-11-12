import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

type Route = {
  path: string;
  title: string;
  to: string;
  component: any;
  children?: Route[];
};

type Props = {
  routes: Route[];
};

export function VerticalMenu({ routes }: Props) {

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(`/admin/${path}`);
  };

  const isSamePath = (routePath: string, currentPath = location.pathname) => {
    const currentClean = currentPath.replace(/^\/+|\/+$/g, '');
    const targetClean = routePath.replace(/^\/+|\/+$/g, '');
    if (targetClean === '' || targetClean === 'admin') {
      return currentClean === '' || currentClean === 'admin';
    }
    return currentClean === targetClean || currentClean.endsWith('/' + targetClean);
  };


  return (
    <div className="flex flex-col h-full bg-primary p-2 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          CLOTHING<span className="font-light text-gray-300">STORE.</span>
        </h2>
      </div>
      <div className="flex flex-col space-y-1 p-0">
        {routes.map((route) => (
          <div key={route.path} className="relative group">
            <div
              onClick={() => handleNavigate(route.to)}
              className={classNames(
                'px-3 py-2 font-sans text-white text-lg font-normal cursor-pointer rounded-md transition-colors',
                {
                  'font-bold text-xl bg-gray-700 text-gray-900': isSamePath(route.to),
                  'text-gray-600 hover:bg-gray-700 ': !isSamePath(route.to),
                }
              )}
            >
              {route.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}