
import { Modal } from "../../../shared/ui/Modal";
import useServices from "../../../hooks/use-service";
import { Services } from "../../../api/services";
import { AppLoader } from "../../../shared/components/AppLoader";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Favourite } from "./types";
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from "react-icons/fi";
import Button from '../../../shared/ui/Button';

type Props = {
  onHide(): void;
};

export function Favourites({ onHide }: Props) {
  const navigate = useNavigate();

  const { loading, data } = useServices(Services.Favourites.list, true);

  const favouriteResults: Favourite[] = useMemo(() => {
    return data ?? [];
  }, [data]);

  const goToProduct = (id: string) => {
    onHide();
    navigate(`/public/products/${id}`);
  };

  return (
    <Modal
      title="My Favourites"
      onHide={onHide}
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-gray-400">
            {favouriteResults.length} saved{" "}
            {favouriteResults.length === 1 ? "item" : "items"}
          </span>

          <Button
            type='primary'
            onClick={onHide}
            className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Button>
        </div>
      }
    >
      <div className="w-full min-w-0">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Saved for later
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Your favourite pieces, all in one place.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
            <FiHeart className="w-5 h-5 text-rose-500" />
          </div>
        </div>
        {loading && <AppLoader />}

        {/* Empty state */}
        {!loading && favouriteResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <FiHeart className="w-7 h-7 text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No favourites yet
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
              Save the items you love and find them here whenever
              you're ready to shop.
            </p>

            <Button
              type="primary"
              onClick={() => {
                onHide();
              }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-gray-950 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Explore Collection
              <FiArrowRight />
            </Button>
          </div>
        )}
        {!loading && favouriteResults.length > 0 && (
          <div className="divide-y divide-gray-100">
            {favouriteResults.map((it) => (
              <div
                key={it.id}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 py-5"
              >
                <div
                  onClick={() => goToProduct(it.product_id)}
                  className="w-24 h-28 sm:w-24 sm:h-28 shrink-0 rounded-lg bg-gray-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={it.image_url}
                    alt={it.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1">
                    {it.brand}
                  </p>
                  <h3
                    onClick={() => goToProduct(it.product_id)}
                    className="text-sm font-semibold text-gray-900 cursor-pointer hover:underline underline-offset-4 line-clamp-2"
                  >
                    {it.name}
                  </h3>
                  <p className="text-base font-semibold text-gray-950 mt-2">
                    €{Number(it.price).toFixed(2)}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <Button
                      type="primary"
                      onClick={() => {}}
                      className="inline-flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                      <FiShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </Button>

                    <Button
                      type="warning"
                      onClick={() => {}}
                      className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      Remove
                    </Button>
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
