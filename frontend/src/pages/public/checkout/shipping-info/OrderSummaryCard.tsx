import { ShoppingCartTypes } from '../../shopping-cart/types';

type Props = {
  data: ShoppingCartTypes | null;
}

export function OrderSummaryCard({ data }: Props) {
  return (
    <div className="w-full max-h-full bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs">
      <div className="pb-4 border-b border-neutral-100">
        <h1 className="text-lg font-semibold tracking-tight text-primary">
          Order Summary
        </h1>
      </div>
      <div className="py-2 max-h-full overflow-y-hidden">
        {data?.items?.map((it: any) => (
          <div key={it.id} className="flex items-start gap-4 py-4">
            <div className="w-20 h-24 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={it.image_url}
                alt={it.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between min-w-0 flex-1">
              <div>
                <p className="text-sm font-semibold text-neutral-900 truncate">
                  {it.name}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  <span>Size: {it.size}</span>
                  <span className="mx-1.5 text-neutral-300">|</span>
                  <span>Color: {it.color}</span>
                  <span className="mx-1.5 text-neutral-300">|</span>
                  <span>Brand: {it.brand}</span>
                </p>
              </div>
              <p className="text-sm font-semibold text-primary mt-2">
                ${it.line_total}
              </p>
              <div className="text-xs text-neutral-500 mt-0.5">
                Quantity: {it.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-neutral-600">
          <span>Total Items</span>
          <span className="font-medium text-neutral-800">
            {data?.total_items}
          </span>
        </div>
        <div className="pt-3 mt-2 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">Total</span>
          <span className="text-base font-bold text-primary">
            ${data?.subtotal}
          </span>
        </div>
      </div>
    </div>
  );
}