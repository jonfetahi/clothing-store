import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiHeart } from 'react-icons/fi';
import { Services } from '../../../api/services';
import { Product } from './types'
import useServices from '../../../hooks/use-service';
import { useBreadcrumbs } from '../../../context/navigation-context';
import Button from '../../../shared/ui/Button';
import NumberEditor from '../../../shared/ui/NumberEditor';
import FormField from '../../../shared/ui/FormField';
import { AppLoader } from '../../../shared/components/AppLoader';
import { useNotify } from '../../../hooks/use-notify';
import { FaHeart } from 'react-icons/fa';


export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  useBreadcrumbs('Mens', 1);
  const { showSuccess } = useNotify();

  const { loading: loadingProduct, data, request: onReload } = useServices(Services.Products.get, !!id, { id });
  const { loading: loadingFavourites, request: requestAddToFavourites } = useServices(Services.Favourites.add, false);
  const { loading: loadingDelete, request: requestDelete } = useServices(Services.Favourites.delete, false);
  const { loading: loadingAddToCart, requestAsync: requestAddToCart } = useServices(Services.ShoppingCart.add, false);

  const product = data as Product | null;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const images = product?.images ?? [];
  const variants = product?.variants ?? [];

  const colors = useMemo(() => {
    return product?.variants.reduce<string[]>((acc, curr) => {
      if (curr.color && !acc.includes(curr.color)) {
        acc.push(curr.color);
      }
      return acc;
    }, []);
  }, [product]);

  const isFavourite = useMemo(() => {
    return product?.is_favourite
  }, [product]);

  const selectedVariant = variants.find(
    (it) => it.id === selectedVariantId
  );
  console.log(selectedVariantId);
  const selectedColor = selectedVariant?.color ?? null;

  const sizes = selectedColor
    ? variants.filter((it) => it.color === selectedColor)
    : variants;


  const handleFavourites = (product_id: string | undefined) => {
    if (isFavourite) {
      requestDelete({ id: product_id });
      showSuccess('Item removed from favourites');
      onReload();
    } else {
      const payload = {
        product_id,
      };
      requestAddToFavourites({ payload });
      showSuccess('Item added to Favourites');
      onReload();

    }
  };

  const handleAddToCart = () => {
   if (!selectedVariantId) return;
    const payload = {
      product_variant_id: selectedVariantId,
      quantity,
    };
    requestAddToCart({ payload }).then(({ data }) => {
      if (data) {
        showSuccess('Item added to Favourites');
      }
    });
  };

  const loading = loadingProduct || loadingFavourites || loadingDelete || loadingAddToCart;

  return (
    <div className="mx-auto w-full py-1">
      <div className="grid grid-cols-10">
        {loading && <AppLoader />}
        <div className="col-start-1 col-end-2">
          {images.length > 0 && (
            <div className="flex justify-center gap-3 overflow-x-auto">
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image?.image_url)}
                  className={`h-40 w-32 shrink-0 overflow-hidden rounded-lg border-2 ${
                    selectedImage === image.image_url
                      ? 'border-black'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={product?.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-start-2 col-end-6">
          <div className="mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-xl bg-gray-100">
            {images.length > 0 ? (
              <img
                src={selectedImage ?? images[0].image_url}
                alt={product?.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>
        <div className="col-start-6 col-end-10 ml-5 lg:pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            {product?.brand?.name}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
            {product?.name}
          </h1>

          <div className="flex flex-row justify-start gap-4 items-center text-gray-500 py-5">
            <div>{product?.brand.name}</div>
            <div className="flex w-1 h-px mt-1 bg-gray-500" />
            <div>{product?.gender.name}</div>
            <div className="flex w-1 h-px mt-1 bg-gray-500" />
            <div>{product?.category.name}</div>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ${Number(product?.price).toFixed(2)}
          </p>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            {product?.description}
          </p>
          <div className="my-8 border-t border-gray-200" />
          <div className="mb-7">
            <FormField label={'Colors'} error={false}>
              {colors?.map((item: string) => (
                <div
                  key={item}
                  className="w-9 h-9 rounded-full mt-2"
                style={{
                  backgroundColor: item,
                }}
              />
            ))}
            </FormField>
          </div>
          <div className="mb-2">
            <FormField label={'Select Size'} error={false}>
              <div className="flex flex-wrap gap-3">
                {sizes.map((variant) => (
                  <div
                    key={variant.id}
                    // disabled={variant.initial_quantity <= 0}
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setQuantity(1);
                    }}
                    className={`min-w-14 rounded-lg border px-3 py-3 text-base text-center transition ${
                      selectedVariantId === variant.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-400 hover:border-gray-500'
                    } disabled:cursor-not-allowed disabled:opacity-30`}
                  >
                    {variant.size}
                  </div>
                ))}
              </div>
            </FormField>
          </div>

          <div className="mb-8">
            <FormField label={'Quantity'} error={false}>
              <div className="inline-flex items-center rounded-lg border border-gray-200">
                <NumberEditor
                  value={quantity}
                  onChange={(v) => setQuantity(v)}
                />
              </div>
            </FormField>
          </div>

          <div className="flex gap-3">
            <Button
              type="primary"
              onClick={handleAddToCart}
              disabled={!selectedVariant}
              className="flex w-full items-center justify-center gap-3"
            >
              <FiShoppingBag size={22} />
              Add to Cart
            </Button>

            <Button
              onClick={() => handleFavourites(product?.id)}
              className="rounded-lg border border-gray-200 px-5 hover:border-gray-400"
            >
              {isFavourite ? <FaHeart size={22} /> : <FiHeart size={22} />}
            </Button>
          </div>

          <div className="mt-7 flex items-center gap-3 text-sm text-gray-500">
            <FiTruck size={18} />
            Shipping information available at checkout
          </div>
        </div>
      </div>
    </div>
  );
}
