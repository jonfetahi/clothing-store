import { useBreadcrumbs } from '../../../context/navigation-context';
import { Services } from '../../../api/services';
import { RecordList } from '../../../shared/components/RecordComponents/RecordList';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RecordEditor } from '../../../shared/components/RecordComponents/RecordEditor';
import gendersForm from './GendersForm';

type Gender = {
  id: string;
  name: string;
}
const formDefinition = [gendersForm()]

export function Genders() {
  useBreadcrumbs('Genders', 2)
  const location = useLocation();

  return (
    <Routes>
      <Route
        index
        element={
          <RecordList
            title={'Categories'}
            pathUrl={location.pathname}
            listRecordService={Services.Genders.list}
            showDeleteButton
            deleteRecordService={Services.Genders.delete}
            listRecords={(gender: Gender) => (
              <div className="flex items-center gap-4 p-4">
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="flex flex-row gap-3 items-center justify-start">
                    <p className='text-lg font-bold'>Name: </p>
                    <p className="text-gray-900">
                      {gender?.name}
                    </p>
                  </div>
                  <div className='flex flex-row gap-3 items-center justify-start'>
                    <p className='text-lg font-bold'>ID: </p>
                    <p className="text-gray-900">
                      {gender?.id}
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
            editTitle="Edit Gender"
            getRecordService={Services.Genders.get}
            updateRecordService={Services.Genders.update}
            formDefinition={formDefinition}
          />
        }
      />
    </Routes>
  );
}