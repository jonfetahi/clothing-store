import { useBreadcrumbs } from '../../../context/navigation-context';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RecordList } from '../../../shared/components/RecordComponents/RecordList';
import { Services } from '../../../api/services';
import { RecordEditor } from '../../../shared/components/RecordComponents/RecordEditor';
import usersForm from './usersForm';
import { FaUser } from 'react-icons/fa';

const formDefinition = [usersForm()];

export function Users() {
  useBreadcrumbs('Users', 2);
  const location = useLocation();

  return (
    <Routes>
      <Route
        index
        element={
          <RecordList
            title={'Users'}
            pathUrl={location.pathname}
            listRecordService={Services.Users.list}
            listRecords={(u: any) => (
              <div
                className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="flex justify-center items-center bg-gray-400 w-12 h-12 rounded-xl">
                    <FaUser size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-semibold text-primary text-base">
                        {u.first_name} {u.last_name}
                      </h4>
                      <span
                        className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                        {u.role}
                      </span></div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>ID: <span className="font-mono text-gray-600">{u.id}</span></span>
                      <span>•</span>
                      <span>Joined {u.created_at}</span>
                    </div>
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
            editTitle="Edit User"
            getRecordService={Services.Users.get}
            updateRecordService={Services.Users.update}
            formDefinition={formDefinition}
          />
        }
      />
    </Routes>
  );
}