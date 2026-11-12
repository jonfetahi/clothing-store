import { useBreadcrumbs } from '../../../context/navigation-context';
import { Services } from '../../../api/services';
import { RecordList } from '../../../shared/components/RecordComponents/RecordList';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RecordEditor } from '../../../shared/components/RecordComponents/RecordEditor';
import brandsForm from './BrandsForm';

type Brand = {
  id: string;
  name: string;
}
const formDefinition = [brandsForm()]

export function Brands() {
  useBreadcrumbs('Brands', 2)
  const location = useLocation();

  return (
    <Routes>
      <Route
        index
        element={
          <RecordList
            title={'Brands'}
            pathUrl={location.pathname}
            listRecordService={Services.Brands.list}
            showDeleteButton
            deleteRecordService={Services.Brands.delete}
            listRecords={(brand: Brand) => (
              <div className="flex items-center gap-4 p-4">
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="flex flex-row gap-3 items-center justify-start">
                    <p className='text-lg font-bold'>Name: </p>
                    <p className="text-gray-900">
                      {brand?.name}
                    </p>
                  </div>
                  <div className='flex flex-row gap-3 items-center justify-start'>
                    <p className='text-lg font-bold'>ID: </p>
                    <p className="text-gray-900">
                      {brand?.id}
                    </p>
                  </div>
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
            editTitle="Edit Brand"
            getRecordService={Services.Brands.get}
            updateRecordService={Services.Brands.update}
            formDefinition={formDefinition}
          />
        }
      />
    </Routes>
  );
}