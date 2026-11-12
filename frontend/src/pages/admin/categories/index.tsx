import { useBreadcrumbs } from '../../../context/navigation-context';
import { Services } from '../../../api/services';
import { RecordList } from '../../../shared/components/RecordComponents/RecordList';
import { Route, Routes, useLocation } from 'react-router-dom';
import categoriesForm from './CategoriesForm';
import { RecordEditor } from '../../../shared/components/RecordComponents/RecordEditor';

type Category = {
  id: string;
  name: string;
}
const formDefinition = [categoriesForm()]

export function Categories() {
  useBreadcrumbs('Categories', 2)
  const location = useLocation();

  return (
    <Routes>
      <Route
        index
        element={
          <RecordList
            title={'Categories'}
            pathUrl={location.pathname}
            listRecordService={Services.Categories.list}
            showDeleteButton
            deleteRecordService={Services.Categories.delete}
            listRecords={(category: Category) => (
              <div className="flex items-center gap-4 p-4">
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="flex flex-row gap-3 items-center justify-start">
                    <p className='text-lg font-bold'>Name: </p>
                    <p className="text-gray-900">
                      {category?.name}
                    </p>
                  </div>
                  <div className='flex flex-row gap-3 items-center justify-start'>
                    <p className='text-lg font-bold'>ID: </p>
                    <p className="text-gray-900">
                      {category?.id}
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
            editTitle="Edit Category"
            getRecordService={Services.Categories.get}
            updateRecordService={Services.Categories.update}
            formDefinition={formDefinition}
          />
        }
      />
    </Routes>
  );
}