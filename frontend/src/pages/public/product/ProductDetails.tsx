import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTruck } from 'react-icons/fi';
import { Services } from '../../../api/services';
import { Product } from './types';
import useServices from '../../../hooks/use-service';
import { useBreadcrumbs } from '../../../context/navigation-context';
import Button from '../../../shared/ui/Button';
import NumberEditor from '../../../shared/ui/NumberEditor';
import FormField from '../../../shared/ui/FormField';
import { AppLoader } from '../../../shared/components/AppLoader';
import { useNotify } from '../../../hooks/use-notify';
import { FaHeart } from 'react-icons/fa';
import { usePublicData } from '../../../context/public-context';
import classNames from 'classnames';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { BsBoxArrowLeft } from 'react-icons/bs';


export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  useBreadcrumbs('Mens', 1);
  useBreadcrumbs('Jackets', 2);
  useBreadcrumbs('Jackets', 3);
  const { showSuccess } = useNotify();
  // @ts-ignore
  const { colors, sizes } = usePublicData();

  const { loading: loadingProduct, data, request: onReload } = useServices(Services.Products.get, !!id, { id });
  const { loading: loadingFavourites, request: requestAddToFavourites } = useServices(Services.Favourites.add, false);
  const { loading: loadingDelete, request: requestDelete } = useServices(Services.Favourites.delete, false);
  const { loading: loadingAddToCart, requestAsync: requestAddToCart } = useServices(Services.ShoppingCart.add, false);

  const product = data as Product | null;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const images = product?.images ?? [];

  const AvailableColors = useMemo(() => {
    const variantColors = product?.variants.map((it: any) => it.color_id);
    return colors?.filter((color: any) => variantColors?.includes(color.id));
  }, [product, colors]);


  const AvailableSizes = (size: string) => {
    return sizes?.find((it: any) => it.id.includes(size))?.name;
  };

  const isFavourite = useMemo(() => {
    return product?.is_favourite;
  }, [product]);


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
    <div className="mx-auto w-full h-full py-1">
      <div className="grid grid-cols-10">
        {loading && <AppLoader />}
        <div className="col-start-1 col-end-2 mx-auto">
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
          <div className="mx-auto aspect-square max-w-lg overflow-hidden rounded-xl bg-gray-100">
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
        <div className="col-start-6 col-end-10 ml-5">
          <h1 className="font-sans text-3xl font-bold tracking-tight text-primary">
            {product?.name}
          </h1>

          <div className="flex flex-row justify-start gap-4 items-center text-gray-500 ">
            <div>{product?.brand.name}</div>
            <div className="flex w-1 h-px mt-1 bg-gray-500" />
            <div>{product?.gender.name}</div>
            <div className="flex w-1 h-px mt-1 bg-gray-500" />
            <div>{product?.category.name}</div>
          </div>
          <p className="mt-2 text-2xl font-semibold text-primary">
            ${Number(product?.price).toFixed(2)}
          </p>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            {product?.description}
          </p>
          <div className="my-4 border-t border-gray-200" />
          <div>
            <FormField label={'Color:'} error={false}>
              {AvailableColors?.map((item: { name: string, id: string }) => (
                <div
                  key={item.id}
                  className="w-9 h-9 rounded-full mt-2"
                  style={{
                    backgroundColor: item.name,
                  }}
                />
              ))}
            </FormField>
          </div>
          <div className="mb-2">
            <FormField label={'Select Size'} error={false}>
              <div className="flex flex-wrap gap-3">
                {product?.variants?.map((variant: any) => (
                  <div
                    key={variant.id}
                    // disabled={variant.initial_quantity <= 0}
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setQuantity(1);
                    }}
                    className={classNames('min-w-14 rounded-lg border px-3 py-3 text-base text-center transition border-gray-400 hover:border-gray-500', {
                      'border-black bg-black text-white': selectedVariantId === variant.id,
                      'cursor-not-allowed disabled:opacity-30': variant.initial_quantity <= 0,
                    })}
                  >
                    {AvailableSizes(variant.size_id)}
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
              disabled={!selectedVariantId}
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
        </div>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-3 h-[6rem] py-5">
        <div className="flex items-center justify-center gap-3 py-3 md:py-0 px-4">
          <FiTruck size={20} className="text-gray-800 shrink-0" />
          <span className="text-sm text-gray-600">
            Shipping information available at checkout
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 py-3 md:py-0 px-4">
          <BsBoxArrowLeft size={20} className="text-gray-800 shrink-0" />
          <span className="text-sm text-gray-600">
            Easy Returns within 30 days
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 py-3 md:py-0 px-4">
          <RiSecurePaymentFill size={20} className="text-gray-800 shrink-0" />
          <span className="text-sm text-gray-600">
            Secure Payment 100% protected
          </span>
        </div>
      </div>
    </div>
  );
}
