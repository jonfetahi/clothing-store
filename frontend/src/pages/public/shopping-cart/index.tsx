import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../shared/ui/Modal';
import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import {  useMemo } from 'react';
import { ShoppingCartItem } from './types';
import { FiArrowRight, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import Button from '../../../shared/ui/Button';
import NumberEditor from '../../../shared/ui/NumberEditor';

type Props = {
  onHide(): void;
}

export function ShoppingCart({ onHide }: Props) {
  const navigate = useNavigate();

  const { data, request: reload} = useServices(Services.ShoppingCart.list, true);
  const {  request: requestDelete } = useServices(Services.ShoppingCart.delete, false);
  const { requestAsync } = useServices(Services.ShoppingCart.update, false);


  const cartItems: ShoppingCartItem[] = useMemo(() => {
    //@ts-ignore
    return data?.items ?? [];
  }, [data])

  const { totalItems, subTotal } = useMemo(() => {
    //@ts-ignore
    const totalItems = data?.total_items ?? 0;
    //@ts-ignore
    const subTotal = data?.subtotal ?? 0;

    return { totalItems, subTotal };
  }, [data]);


  const onUpdateQuantity = (quantity: number, id: string) => {
    const payload = { quantity };
    requestAsync({ payload, id }).then((data) => {
      if (data) {
        reload();
      }
    });
  };

  const onRemove = (id: string) => {
    requestDelete({ id });
    reload();
  };

  const goToProduct = (id: string) => {
    onHide();
    navigate(`/public/products/${id}`);
  };

  return (
    <Modal
      title="Shopping Cart"
      onHide={onHide}
      height='fixed'
      className='absolute !h-full !right-1 !top-2 !bottom-2 !w-1/3 !translate-y-0 !transform !transition-transform !duration-800 !ease-out'
      footer={
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">
                Subtotal
              </p>
              <p className="text-xl font-bold text-gray-950">
                €{subTotal.toFixed(2)}
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <Button
            type="primary"
            onClick={() => {}}
            disabled={cartItems.length === 0}
            className="w-full flex items-center justify-center"
          >
            Proceed to Checkout
            <FiArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-[11px] text-center text-gray-400">
            Shipping and taxes calculated at checkout
          </p>
        </div>
      }
    >
      <div className="w-full min-w-0">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Your Bag
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Review your items before checkout.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <FiShoppingBag className="w-5 h-5 text-gray-700" />
          </div>
        </div>
        {//@ts-ignore
          cartItems?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <FiShoppingBag className="w-7 h-7 text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Your bag is empty
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
              Discover something you love and add it to your bag.
            </p>

            <Button
              type="primary"
              onClick={() => onHide()}
              className="mt-6 inline-flex items-center gap-2 "
            >
              Explore Collection
              <FiArrowRight />
            </Button>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="divide-y divide-gray-100 max-h-[450px] overflow-y-auto pr-1">
            {cartItems.map((item: ShoppingCartItem) => (
              <div
                key={item.id}
                className="flex gap-4 py-5"
              >
                <div
                  onClick={() => goToProduct(item.product_id)}
                  className="w-24 h-28 shrink-0 rounded-lg bg-gray-100 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1">
                        {item.brand}
                      </p>

                      <h3
                        onClick={() => goToProduct(item.product_id)}
                        className="text-sm font-semibold text-gray-900 cursor-pointer hover:underline underline-offset-4"
                      >
                        {item.name}
                      </h3>
                    </div>

                    <Button
                      type='warning'
                      onClick={() => onRemove(item.id)}
                      title="Remove item"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>Size: {item.size}</span>
                    <span className="text-gray-300">|</span>
                    <span>Color: {item.color}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-4">
                    <div className="inline-flex items-center rounded-lg overflow-hidden">
                      <NumberEditor
                        value={item.quantity}
                        onChange={(q: number) => onUpdateQuantity(q, item.id)}
                        className='!w-2/3 !h-10'
                      />
                    </div>

                    <span className="text-sm font-bold text-gray-950 whitespace-nowrap">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}