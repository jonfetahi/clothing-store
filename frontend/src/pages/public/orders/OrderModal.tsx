import { Modal } from '../../../shared/ui/Modal';
import Button from '../../../shared/ui/Button';
import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import { AppLoader } from '../../../shared/components/AppLoader';
import moment from 'moment';
import { FaBoxOpen, FaCreditCard, FaReceipt } from 'react-icons/fa6';
import { OrderDetails } from './types';
import classNames from 'classnames';
import { FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

type Props = {
  id:string;
  onHide(): void;
}

export function OrderModal({ onHide, id }: Props) {
  const { loading, data } = useServices(Services.Orders.get, !!id, { id });

  const order = data as OrderDetails | null;

  const isCard = order?.payment_method?.toLowerCase() === 'card';

  return (
    <Modal
      title="Order Details"
      width="auto"
      height="auto"
      onHide={onHide}
      footer={
        <div className="w-full flex justify-center">
          <div>
            <Button onClick={onHide} type="warning">
              Close
            </Button>
          </div>
        </div>
      }
    >
      {loading && <AppLoader />}

      {!loading && order && (
        <div className="w-full max-w-2xl max-h-[75vh] overflow-y-auto px-1 py-1 space-y-5">
          {/* Status & Order Meta */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm font-semibold text-neutral-900">
                  Order #{order.id}
                </span>
                <span
                  className={classNames(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    {
                      'bg-amber-50 text-amber-700 border-amber-200':
                        order.status?.toLowerCase() === 'pending',
                      'bg-emerald-50 text-emerald-700 border-emerald-200': [
                        'completed',
                        'delivered',
                        'paid',
                      ].includes(order.status?.toLowerCase()),
                      'bg-neutral-100 text-neutral-700 border-neutral-200': ![
                        'pending',
                        'completed',
                        'delivered',
                        'paid',
                      ].includes(order.status?.toLowerCase()),
                    },
                  )}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-xs text-neutral-500">
                Placed{' '}
                {moment(order.created_at).format('MMM D, YYYY [at] h:mm A')}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="block text-[11px] uppercase tracking-wider text-neutral-400">
                Total
              </span>
              <span className="text-base font-bold text-neutral-900">
                ${order.total_amount}
              </span>
            </div>
          </div>

          {/* Shipping & Payment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <FaMapMarkerAlt size={12} className="text-neutral-400" />
                <span>Shipping & Contact</span>
              </div>
              <div className="space-y-0.5 text-sm">
                <p className="font-semibold text-neutral-900">
                  {order.first_name} {order.last_name}
                </p>
                <p className="text-xs text-neutral-600">
                  {order.email_address}
                </p>
                <p className="text-xs text-neutral-600 pt-1">
                  {order.address}, {order.postal_code} {order.city}
                </p>
                <p className="text-xs font-medium text-neutral-700">
                  {order.country}
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {isCard ? (
                  <FaCreditCard size={12} className="text-neutral-400" />
                ) : (
                  <FaMoneyBillWave size={12} className="text-neutral-400" />
                )}
                <span>Payment</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Method</span>
                  <span className="font-medium text-neutral-900 uppercase">
                    {order.payment_method}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Status</span>
                  <span className="font-medium text-neutral-900 capitalize">
                    {order.payment_status}
                  </span>
                </div>

                {order.payment_reference && (
                  <div className="pt-1.5 border-t border-neutral-200/70">
                    <span className="block text-[11px] text-neutral-400">
                      Reference
                    </span>
                    <span className="font-mono text-[11px] text-neutral-700 break-all">
                      {order.payment_reference}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <FaBoxOpen size={13} className="text-neutral-400" />
              <span>
                Items ({order.total_items ?? order.items?.length ?? 0})
              </span>
            </div>

            <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-100 bg-white">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 p-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-16 h-20 bg-neutral-100 rounded-xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {item.name}
                      </p>

                      <p className="text-xs text-neutral-500 flex items-center flex-wrap gap-1.5">
                        {item.brand && <span>{item.brand}</span>}
                        {item.brand && (item.size || item.color) && (
                          <span className="text-neutral-300">|</span>
                        )}
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && (
                          <span className="text-neutral-300">|</span>
                        )}
                        {item.color && <span>Color: {item.color}</span>}
                      </p>

                      <p className="text-xs text-neutral-500 pt-0.5">
                        Qty:{' '}
                        <span className="font-medium text-neutral-700">
                          {item.quantity}
                        </span>{' '}
                        <span className="text-neutral-300">×</span>{' '}
                        <span>${item.unit_price}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-neutral-900">
                      ${item.line_total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Footer Box */}
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-neutral-500 pb-1">
              <FaReceipt size={11} className="text-neutral-400" />
              <span>Summary</span>
            </div>

            <div className="flex items-center justify-between text-neutral-600">
              <span>Last Updated</span>
              <span className="text-neutral-700">
                {order.updated_at
                  ? moment(order.updated_at).fromNow()
                  : moment(order.created_at).fromNow()}
              </span>
            </div>

            <div className="pt-2.5 mt-1 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-900">
                Total Amount
              </span>
              <span className="text-base font-bold text-neutral-900">
                ${order.total_amount}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}