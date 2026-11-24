import { Home } from './home';
import { ProductDetails } from './product/ProductDetails';
import { Login } from './login/Login';
import { Register } from './register/Register';
import { CheckoutWizard } from './checkout/CheckoutWizard';
import { Orders } from './orders';
import { useAuth } from '../../context/auth-context';


export function useAllRoutes() {
  const { isAuthenticated } = useAuth();
  return [
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
      path: 'products/:id',
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
    },
    {
      path: 'checkout',
      title: 'Checkout',
      component: CheckoutWizard,
      menu: false
    },
    {
      path: 'orders',
      title: 'Orders',
      component: Orders,
      menu: isAuthenticated,
    }
  ]
}
