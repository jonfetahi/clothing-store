import { Product } from '../../pages/public/product/types';

type Props = {
  product: Product;
  onClick?: (id: string) => void;
};

export function ProductCard({ product, onClick }: Props) {
  const image =
    product.images?.find((it) => it.is_primary) ??
    product.images?.[0];



  return (
    <div
      onClick={() => onClick?.(product.id)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        {image ? (
          <img
            src={image.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image available
          </div>
        )}

        <div className="absolute left-3 top-3 rounded bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide">
          {product.category?.name}
        </div>
      </div>

      <div className="space-y-1 pt-3">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {product.brand?.name}
        </p>

        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-gray-500">
          {product.name}
        </h3>

        <p className="pt-1 text-sm font-semibold text-gray-900">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
