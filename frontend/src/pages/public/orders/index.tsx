import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import Button from '../../../shared/ui/Button';
import moment from 'moment';
import { OrderModal } from './OrderModal';
import { useBreadcrumbs } from '../../../context/navigation-context';


const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export function Orders() {
  useBreadcrumbs('Orders', 2)
  const [selectedId, setSelectedId] = useState("");
  const [orderModal, setOrderModal] = useState(false);
  const navigate = useNavigate();

  const { loading, data: orders, error } = useServices(Services.Orders.list, true);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">
          My Orders
        </h1>

        <p className="text-sm text-secondary mt-1">
          View and manage your previous orders.
        </p>
      </div>

      {loading && (
        <div className="py-12 text-center text-secondary">
          Loading orders...
        </div>
      )}

      {!loading && error && (
        <div className="py-12 text-center text-red-600">
          Failed to retrieve orders.
        </div>
      )}

      {/*@ts-ignore*/}
      {!loading && !error && !orders?.length && (
        <div className="border rounded-lg py-16 text-center">
          <h2 className="font-semibold text-gray-800">
            No orders yet
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Your orders will appear here once you
            make a purchase.
          </p>
          <Button
            type={'primary'}
            onClick={() => navigate('/public')}
            className="mt-5 px-5 py-2 rounded-md text-sm"
          >
            Continue Shopping
          </Button>
        </div>
      )}
      {!loading && !error && (
        <div className="space-y-4">
          {/*@ts-ignore*/}
          {orders?.map((order: any) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h2 className="font-semibold text-primary">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {moment.utc(order.created_at).fromNow()}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 p-5">
                <div>
                  <p className="text-xs text-gray-500">
                    Total Items
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {order.total_items}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Payment Method
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {order.payment_method === 'card'
                      ? 'Credit / Debit Card'
                      : order.payment_method === 'cash_on_delivery'
                        ? 'Cash on Delivery'
                        : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Total Amount
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    ${Number(
                    order.total_amount,
                  ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end px-5 pb-5">
                <Button
                  type={'primary'}
                  onClick={() => {
                    setOrderModal(true);
                    setSelectedId(order.id);
                  }}
                >
                  View Details &rarr;
                </Button>
              </div>
            </div>
          ))}
          {orderModal && (
            <OrderModal
              onHide={() => setOrderModal(false)}
              id={selectedId}
            />
          )}
        </div>
      )}
    </div>
  );
};

