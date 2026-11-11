import { Home } from './home';
import { ProductDetails } from './product/ProductDetails';
import { Login } from './login/Login';
import { Register } from './register/Register';

export const AllRoutes = [
  {
    index: true,
    path: '',
    title: 'Home',
    component: Home,
    menu: true,
  },
  {
    path: 'men',
    title: 'Men',
    component: Home,
    menu: true
  },
  {
    path: 'women',
    title: 'Women',
    component: Home,
    menu: true
  },
  {
    path: 'product/:id',
    title: 'Product',
    component: ProductDetails,
    menu: false
  },
  {
    path: 'login',
    title: 'Login',
    component: Login,
    menu: false
  },
  {
    path: 'register',
    title: 'Register',
    component: Register,
    menu: false
  }
];