import TextInput from '../../../shared/ui/TextInput';
import FormField from '../../../shared/ui/FormField';
import { useMemo } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import PriceInput from '../../../shared/ui/PriceInput';
import SelectInput from '../../../shared/ui/SelectInput';
import NumberEditor from '../../../shared/ui/NumberEditor';
import Button from '../../../shared/ui/Button';
import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import { useFileUpload } from '../../../hooks/use-file-upload';
import { ACCEPTED_IMAGE_CONFIG } from '../../../config/constants';
import { AppLoader } from '../../../shared/components/AppLoader';
import classNames from 'classnames';
import { FiImage, FiStar, FiUploadCloud } from 'react-icons/fi';

type Props = {
  fields: any;
  values: any;
  errors: { [key: string]: string };
  value: { [key: string]: any }
}

export function ProductForm({ fields, errors, values, value }: Props) {
  const { loading, requestAsync } = useServices(Services.Images.upload, false)

  const { brandOptions, genderOptions, categoryOptions, sizesOptions, colorsOptions } = useMemo(() => {
    const brandOptions = value?.brands?.map((it: any) => ({ value: it.id, name: it.name }));
    const genderOptions = value?.genders?.map((it: any) => ({ value: it.id, name: it.name }));
    const categoryOptions = value?.categories?.map((it: any) => ({ value: it.id, name: it.name }));
    const sizesOptions = value?.sizes?.map((it: any) => ({ value: it.id, name: it.name }));
    const colorsOptions = value?.colors?.map((it: any) => ({ value: it.id, name: it.name }));
    return { brandOptions, genderOptions, categoryOptions, sizesOptions, colorsOptions };
  }, [value]);

  const onUploadImage = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'image_clothingstore');
    //@ts-ignore
    requestAsync({}, formData).then((data) => {
      if (data?.secure_url) {
        const images = Array.isArray(values.images)
          ? values.images
          : [];

        fields.images.onChange([
          ...images,
          {
            image_url: data.secure_url,
            public_id: data.public_id,
            display_order: images.length + 1,
            is_primary: images.length === 0
          }
        ]);
      }
    });
  };

  const { onUpload, dropZone, dragging, } = useFileUpload(onUploadImage, ACCEPTED_IMAGE_CONFIG)

  const onChangeField = (index: number, key: string, v: any) => {
    const currentVariants = values?.variants || [];
    const updatedVariants = [...currentVariants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [key]: v,
    };
    fields?.variants?.onChange(updatedVariants);
  };

  const onAddNewVariant = () => {
    const newVariant = {
      size_id: '',
      color_id: '',
      initial_quantity: 0,
    };
    fields.variants.onChange([...values.variants, newVariant]);
  };

  const onRemoveVariant = (id: string) => {
    fields.variants.onChange(values.variants.filter((it: any) => it.id !== id));
  };


  return (
    <div className="grid grid-cols-12 gap-2">
      {loading && <AppLoader />}
      <div className="col-span-6 border rounded-lg p-4">
        <FormField label={'Name'} error={false} className={'col-span-5'} labelClassName="!font-light">
          <TextInput
            {...fields.name}
            className="w-full"
            placeholder={'Name'}
            hasError={Boolean(errors.name)}
          />
        </FormField>

        <FormField label={'Description'} error={false} className={'col-span-5'} labelClassName="!font-light">
          <TextInput
            {...fields.description}
            className="w-full"
            multiline
            placeholder={'Description'}
            hasError={Boolean(errors.description)}
          />
        </FormField>
        <FormField label={'Price'} error={false} className={'col-span-5'} labelClassName="!font-light">
          <PriceInput
            {...fields.price}
            className="w-1/3"
            placeholder={'Description'}
            hasError={Boolean(errors.description)}
          />
        </FormField>
        <div className="flex flex-row justify-between gap-2">
          <FormField label={'Category'} error={false} className="w-1/3" labelClassName="!font-light">
            <SelectInput
              className="w-full"
              value={values.category_id}
              onChange={(v) => fields.category_id.onChange(v)}
              options={categoryOptions}
              placeholder={'Category'}
            />
          </FormField>
          <FormField label={'Brand'} error={false} className="w-1/3" labelClassName="!font-light">
            <SelectInput
              className="w-full"
              value={values.brand_id}
              onChange={(v) => fields.brand_id.onChange(v)}
              options={brandOptions}
              placeholder={'Brand'}
            />
          </FormField>
          <FormField label={'Gender'} error={false} className="w-1/3" labelClassName="!font-light">
            <SelectInput
              className="w-full"
              value={values.gender_id}
              onChange={(v) => fields.gender_id.onChange(v)}
              options={genderOptions}
              placeholder={'Gender'}
            />
          </FormField>
        </div>
      </div>

      <div className="col-span-6 bg-gray-50 rounded-lg p-2">
        <div className="flex flex-row items-center gap-2 ">
          <FormField label="Product Images" error={false}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">
                Uploaded images
              </span>
              <span className="text-xs font-medium text-gray-500">
                {values.images.length} images
              </span>
            </div>
            <div className="w-2/3 h-full overflow-x-auto pr-1">
              {values.images.length > 0 ? (
                <div className="grid grid-cols-2 ">
                  {values.images.map((it: any) => (
                    <div
                      key={it.image_url}
                      className="group rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-sm transition-all duration-200"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={it.image_url}
                          alt={`Product image ${it.display_order}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center justify-between px-3 py-2">
                        {it.is_primary ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                            <FiStar size={12} />
                            Primary
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Image {it.display_order}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          #{it.display_order}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 rounded-xl border border-gray-200 bg-gray-50/50"
                >
                  <FiImage size={28} className="text-gray-400 mb-3" />
                  <span className="text-sm font-medium text-gray-600">
                    No images uploaded
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Upload images to display them here
                  </span>
                </div>
              )}
            </div>

          <div
            {...dropZone}
            onClick={onUpload}
            className={classNames(
              'group flex flex-col items-center justify-center gap-3',
              'w-full h-56 rounded-xl border border-dashed border-2',
              'cursor-pointer transition-all duration-200',
              {
                'border-slate-400 bg-slate-100': dragging,
                'border-gray-300 bg-gray-50/50 hover:bg-gray-50 hover:border-slate-400': !dragging,
              },
            )}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl border border-gray-400 bg-white shadow-sm
            group-hover:scale-105 transition-transform duration-200"
            >
              <FiUploadCloud size={23} className="text-slate-600" />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                {dragging ? (
                  <span className="font-medium text-primary">
                    Drop your image here
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-primary">
                      Click to upload
                    </span>
                    {' or drag and drop'}
                  </>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1.5">
                PNG or JPEG
              </p>
            </div>
          </div>
          </FormField>
        </div>
        <div>
          <FormField label={'Variants (Size, Color, Quantity)'} error={false}>
            {values?.variants?.map((variant: any, idx: number) => {
              return (
                <div key={idx} className="grid grid-cols-4 gap-2.5">
                  <SelectInput
                    value={variant.size_id}
                    onChange={(v) => onChangeField(idx, 'size_id', v)}
                    options={sizesOptions}
                    placeholder={'Size'}
                    getValue
                    className="w-full"
                  />
                  <SelectInput
                    value={variant.color_id}
                    onChange={(v) => onChangeField(idx, 'color_id', v)}
                    options={colorsOptions}
                    placeholder={'Color'}
                    className="w-full"
                  />
                  <NumberEditor
                    value={variant.initial_quantity}
                    onChange={(v) => onChangeField(idx, 'initial_quantity', v)}
                    min={1}
                    className="w-full"
                  />
                  <div className="flex items-center">
                    <Button onClick={() => onRemoveVariant(variant.id)} small type="warning">Remove</Button></div>
                  <div>
                  </div>
                </div>
              );
            })}
            <Button
              type="secondary"
              onClick={onAddNewVariant}
              small
            >
              <AiOutlinePlus size={22} />
              Add Variant
            </Button>
          </FormField>
        </div>
      </div>
    </div>
  );
}

export default function productForm() {
  return {
    definition: {
      name: '',
      description: '',
      price: '',
      images: [],
      category_id: '',
      brand_id: '',
      gender_id: '',
      variants: [{
        size_id: '',
        color_id: '',
        initial_quantity: 0,
      }],
    },
    Form: ProductForm,
  };
}