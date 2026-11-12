import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { MdFavoriteBorder } from 'react-icons/md';
import { useEffect, useMemo, useState } from 'react';
import { ShoppingCart } from '../../pages/public/shopping-cart';
import { Favourites } from '../../pages/public/favourite';
import SelectInput from '../ui/SelectInput';
import useServices from '../../hooks/use-service';
import { Services } from '../../api/services';
import { Product } from '../../pages/public/product/types';
import { useAuth } from '../../context/auth-context';

type Route = {
  path: string;
  title: string;
  component: any;
  children?: Route[];
};

type Props = {
  routes: Route[];
};

export function HorizontalMenu({ routes }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shoppingCart, setShoppingCart] = useState(false);
  const [favouriteModal, setFavouriteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Product[]>([]);


  const { loading, requestAsync } = useServices(Services.Products.search, false, { search });

  const searchResults = useMemo(() => {
    return data?.map((it: Product) => ({
      value: it.id,
      name: it.name,
      render: (
        <div
          onClick={() => goToProduct(it.id)}
          className="group flex flex-row items-center gap-4 rounded-xl transition-all duration-200"
        >
          <div
            className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={it.images[0]?.image_url}
              alt={it.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate  transition-colors">
              {it.name}
            </div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5 truncate">
              {it.brand?.name}
            </div>
          </div>
        </div>
      ),
    }))
  }, [data]);

  useEffect(() => {
    if (!search) {
      setData([]);
      return;
    }

    requestAsync().then((res) => {
      if (res) {
        setData(res);
      }
    });
  }, [search]);

  const goToProduct = (id: string) => {
    navigate(`/public/products/${id}`);
  };

  const handleNavigate = (path: string) => {
    navigate(`/public/${path}`);
  };


  const isSamePath = (routePath: string, currentPath = location.pathname) => {
    const currentClean = currentPath.replace(/^\/+|\/+$/g, '');
    const targetClean = routePath.replace(/^\/+|\/+$/g, '');
    if (targetClean === '' || targetClean === 'public') {
      return currentClean === '' || currentClean === 'public';
    }
    return currentClean === targetClean || currentClean.endsWith('/' + targetClean);
  };
  return (
    <div className="grid grid-cols-10 bg-white border-b  border-b-gray-600 shadow py-5 px-4 gap-3">
      <div className="col-span-1 ">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          CLOTHING<span className="font-light">STORE.</span>
        </h2>
      </div>
      <div className="flex space-x-9 justify-center col-start-2 col-span-5">
        {routes.map((route) => (
          <div key={route.path} className="relative group">
            <div
              onClick={() => handleNavigate(route.path)}
              className={classNames('px-3 py-2 font-sans cursor-pointer', { 'font-extrabold': isSamePath(route.path) })}
            >
              {route.title}
            </div>

            {route.children && (
              <div className="absolute left-0 hidden group-hover:block bg-white shadow-lg rounded z-50">
                {route.children.map((child) => (
                  <div
                    key={child.path}
                    onClick={() => handleNavigate(child.path)}
                    className={classNames('block px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 whitespace-nowrap text-left', { 'text-blue-500': isSamePath(child.path) })}
                  >
                    {child.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='col-span-3'>
        <SelectInput
          value={null}
          onSearchText={setSearch}
          onChange={() => {}}
          autocomplete
          debounce
          debounceDelay={500}
          loading={loading}
          options={searchResults}
        />
      </div>
      <div className='flex flex-row gap-3 justify-center'>
        <MdFavoriteBorder size={27} className='hover:cursor-pointer transition-transform duration-200 hover:scale-125' onClick={() => setFavouriteModal(true)}/>
        <FiShoppingCart size={27} className='hover:cursor-pointer transition-transform duration-200 hover:scale-125'  onClick={() => setShoppingCart(true)} />
        <div>
          <AiOutlineUser
            size={27} className="hover:cursor-pointer transition-transform duration-200 hover:scale-125"
            onClick={() => navigate('/public/login')} />
          {/*@ts-ignore*/}
          <div>{user?.first_name}</div>
        </div>
      </div>
      {shoppingCart && (
       <ShoppingCart onHide={() => setShoppingCart(false)} />
      )}
      {favouriteModal && (
        <Favourites onHide={() => setFavouriteModal(false)} />
      )}
    </div>
  );
}