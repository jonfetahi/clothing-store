import useService from '../../../hooks/use-service';
import React, { useMemo, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import classNames from 'classnames';
import { useNotify } from '../../../hooks/use-notify';
import { Modal } from '../../ui/Modal';
import Button from '../../ui/Button';
import { useNavigate } from 'react-router-dom';
import { AppLoader } from '../AppLoader';
import TextInput from '../../ui/TextInput';
import { Container } from '../../ui/Container';

type Props = {
  listRecordService: any;
  deleteRecordService?: any;
  showDeleteButton?: boolean;
  listRecords: (item: any) => React.ReactNode;
  pathUrl: string;
  title?: string;
  Icon?: any;
};

export function RecordList(props: Props) {
  const { showSuccess } = useNotify();
  const navigate = useNavigate();
  const {
    listRecordService,
    listRecords,
    showDeleteButton,
    deleteRecordService,
    pathUrl,
    title,
    Icon,
  } = props;

  const [searchText, setSearchText] = useState('');
  const [recordId, setRecordId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    loading: loadingList,
    data,
    request: reload,
  } = useService(listRecordService, true);


  const listData = data as any;


  const filteredData = useMemo(() => {
    return listData?.filter((it: any) => {
      if (it?.name) {
        return it?.name?.toLowerCase().includes(searchText.toLowerCase());
      } else if (it?.id) {
        return it?.id?.toLowerCase().includes(searchText.toLowerCase());
      }
      return null;
    });
  }, [listData, searchText]);

  const { loading: loadingDelete, requestAsync } = useService(
    deleteRecordService,
    false,
  );

  const onDeleteRecord = () => {
    requestAsync({ id: recordId }).then((data) => {
      if (data) {
        setShowDeleteModal(false);
        showSuccess(data.message ?? 'lbl_successfully_deleted', 'Successfully deleted record');
        reload();
      }
    });
  };

  const onCreate = () => {
    navigate(`${pathUrl}/create`);
  };


  const Loading = loadingList || loadingDelete;

  return (
    <div className="w-full mx-auto mt-5">
      {Loading && <AppLoader />}
      <h1 className="flex text-xl font-sans font-bold justify-start px-5 items-center">{title}</h1>
      <Container>
        <div className="flex flex-row justify-between gap-5">
          <div className="w-full mb-5">
            <TextInput
              value={searchText}
              onChange={setSearchText}
              Icon={AiOutlineSearch}
              placeholder={'Search'}
            />
          </div>
          <div className="flex flex-row">
            <div>
              <Button onClick={onCreate} type="primary">
                Add
              </Button>
            </div>
          </div>
        </div>

        {filteredData?.map((item: any) => (
          <div
            key={item?.id}
            onClick={() => navigate(`${pathUrl}/${item?.id}`)}
            className="group flex items-center gap-4 my-2 rounded-xl border border-gray-300 bg-white px-4 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-gray-300 hover:shadow-md cursor-pointer"
          >
            {Icon && (
              <div
                className={classNames(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  item.is_active
                    ? 'bg-green-100 text-green-600 border-2 border-green-400'
                    : 'bg-gray-100 text-gray-400',
                )}
              >
                <Icon size={22} className="text-gray-500  cursor-text" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-col items-start">
                {item.is_active && (
                  <span
                    className={classNames(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      item.is_active
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500',
                    )}
                  >
                  {item.is_active ? 'Active': 'Inactive'}
                </span>
                )}
                <div>{listRecords(item)}</div>

              </div>
            </div>
            {showDeleteButton && (
              <div
                className="shrink-0"
                onClick={(event) => event.stopPropagation()}
              >
                <Button
                  type="warning"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setRecordId(item.id);
                  }}
                >
                 Delete
                </Button>
              </div>
            )}
          </div>
        ))}

        {showDeleteModal && (
          <Modal
            title={'Delete Record'}
            width="auto"
            height="auto"
            onHide={() => setShowDeleteModal(false)}
            footer={
              <>
                <Button onClick={() => setShowDeleteModal(false)} type="secondary">
                  Cancel
                </Button>
                <Button onClick={onDeleteRecord} type="warning">
                   Delete
                </Button>
              </>
            }
          >
            <span>
              {'Are you sure you want to delete this record?'}
            </span>
          </Modal>
        )}
      </Container>
    </div>
  );
}