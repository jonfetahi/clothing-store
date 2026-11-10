import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import TextInput from '../ui/TextInput';
import { AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { MdFavoriteBorder } from 'react-icons/md';
import { useState } from 'react';
import { ShoppingCart } from '../../pages/public/shopping-cart';
import { Favourites } from '../../pages/public/favourite';

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
  const [shoppingCart, setShoppingCart] = useState(false);
  const [favouriteModal, setFavouriteModal] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(`/public/${path}`);
};

  const isSamePath = (path: string) => location.pathname.includes(path);

  return (
    <div className='grid grid-cols-10 bg-white border-b  border-b-gray-600 shadow py-5 px-4 gap-3'>
      <div className='col-span-1 text-xl font-bold'>Clothify</div>
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
        <TextInput
          //@ts-ignore
          Icon={AiOutlineSearch}
          value={''}
          onChange={() => {}}
          placeholder={'Search For Products'}
        />
      </div>
      <div className='flex flex-row gap-3 justify-center'>
        <MdFavoriteBorder size={27} className='hover:cursor-pointer transition-transform duration-200 hover:scale-125' onClick={() => setFavouriteModal(true)}/>
        <FiShoppingCart size={27} className='hover:cursor-pointer transition-transform duration-200 hover:scale-125'  onClick={() => setShoppingCart(true)} />
        <AiOutlineUser size={27} className='hover:cursor-pointer transition-transform duration-200 hover:scale-125' onClick={() => navigate('/public/login')}/>
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