import { useBreadcrumbs } from '../../../context/navigation-context';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RecordList } from '../../../shared/components/RecordComponents/RecordList';
import { Services } from '../../../api/services';
import { RecordEditor } from '../../../shared/components/RecordComponents/RecordEditor';
import productForm from './ProductForm';
import { RecordCreator } from '../../../shared/components/RecordComponents/RecordCreator';

const formDefinition = [productForm()]

export function ProductsPage() {
  useBreadcrumbs('Products', 2)
  const location = useLocation();

  return (
    <Routes>
      <Route
        index
        element={
          <RecordList
            title={'Products'}
            pathUrl={location.pathname}
            listRecordService={Services.Products.list}
            listRecords={(product) => (
              <div className="flex items-center gap-4 p-4">
                <img
                  src={product.images[0]?.image_url}
                  alt={product.name || 'Product image'}
                  className="h-20 w-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                />
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="flex flex-row gap-3 items-center justify-start">
                    <p className="text-gray-900">
                      {product.brand?.name}
                    </p>
                    <div className='bg-black w-1 h-1 rounded-full mt-1'/>
                    <h3 className="font-semibold text-gray-900 text-base truncate">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                    {product.description}
                  </p>
                </div>
              </div>
            )}
          />
        }
      />
      <Route
        path={':id'}
        element={
          <RecordEditor
            path={`${location.pathname}/:id`}
            editTitle="Edit Product"
            getRecordService={Services.Products.get}
            updateRecordService={Services.Products.update}
            formDefinition={formDefinition}
            additionalServices={{
              brands: Services.Brands.list,
              categories: Services.Categories.list,
              genders: Services.Genders.list,
              sizes: Services.Sizes.list,
              colors: Services.Colors.list,
            }}
          />
        }
      />
      <Route
        path={'/create'}
        element={
          <RecordCreator
            createTitle={'Add Product'}
            createRecordService={Services.Products.update}
            formDefinition={formDefinition}
            additionalServices={{
              brands: Services.Brands.list,
              categories: Services.Categories.list,
              genders: Services.Genders.list,
              sizes: Services.Sizes.list,
              colors: Services.Colors.list,
            }}
          />
        }
      />
    </Routes>
  );
}