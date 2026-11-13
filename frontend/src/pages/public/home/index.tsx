import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../../../shared/components/ProductCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product } from '../product/types';

type Category = {
  id: string;
  name: string;
};

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  console.log(location.pathname);

  const gender = useMemo(() => {
    if (location.pathname.includes('women')) {
      return location.pathname.split('/')[2];
    } else if (location.pathname.includes('men')) {
      return location.pathname.split('/')[2];
    } else {
      return '';
    }
  }, [location.pathname]);


  console.log(gender);

  const {
    loading: loadingCategories,
    data: categories,
  } = useServices(Services.Categories.list, true);

  const {
    loading: loadingProducts,
    requestAsync
  } = useServices(Services.Products.getByGender, false,  { gender });

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    requestAsync().then((res) => {
      setProducts(res);
    })
  }, [gender])

  const loading = loadingCategories || loadingProducts;
  const categoryList: Category[] = categories ?? [];
  const productList: Product[] = useMemo(() => {
    return products ?? [];
  }, [products])


  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return productList;

    return productList.filter(
      (product) => product.category?.id === selectedCategory
    );
  }, [products, selectedCategory]);


  const onGoToProduct = (id: string) => {
    navigate(`${location.pathname.slice(0,7)}/products/${id}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
          The Collection
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          Discover Your Style
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Explore our collection of everyday essentials and standout pieces.
        </p>
      </div>
      <div className="mb-10 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
            selectedCategory === null
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Products
        </button>

        {categoryList.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              selectedCategory === category.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {selectedCategory
            ? categoryList.find((it) => it.id === selectedCategory)?.name
            : 'All Products'}
        </h2>

        <span className="text-sm text-gray-500">
          {filteredProducts.length} Products
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] rounded-xl bg-gray-200" />
              <div className="mt-4 h-3 w-20 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-36 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-24 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try selecting another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onGoToProduct(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
