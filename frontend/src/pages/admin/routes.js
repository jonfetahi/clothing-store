import { Dashboard } from './dashboard';
import { ProductsPage } from './productsPage';
import { Categories } from './categories';
import { Brands } from './brands';
import { Genders } from './genders';

export const AdminRoutes = [
  {
    index: true,
    path: '',
    to: '',
    title: 'Dashboard',
    component: Dashboard,
  },
  {
    path: 'products/*',
    to: 'products',
    title: 'Products',
    component: ProductsPage,
  },
  {
    path: 'categories/*',
    to: 'categories',
    title: 'Categories',
    component: Categories,
  },
  {
    path: 'brands/*',
    to: 'brands',
    title: 'Brands',
    component: Brands,
  },
  {
    path: 'genders/*',
    to: 'genders',
    title: 'Genders',
    component: Genders,
  },
];