import TextInput from '../../../shared/ui/TextInput';
import FormField from '../../../shared/ui/FormField';
import { useMemo } from 'react';
import { AiFillPlusCircle, AiOutlinePlus } from 'react-icons/ai';
import PriceInput from '../../../shared/ui/PriceInput';
import SelectInput from '../../../shared/ui/SelectInput';
import NumberEditor from '../../../shared/ui/NumberEditor';
import Button from '../../../shared/ui/Button';

type Props = {
  fields: any;
  values: any;
  errors: { [key: string]: string };
  value: { [key: string]: any }
}

export function ProductForm({ fields, errors, values, value }: Props) {

  const { brandOptions, genderOptions, categoryOptions, sizesOptions, colorsOptions } = useMemo(() => {

    const brandOptions = value?.brands?.map((it: any) => ({ value: it.id, name: it.name }));
    const genderOptions = value?.genders?.map((it: any) => ({ value: it.id, name: it.name }));
    const categoryOptions = value?.categories?.map((it: any) => ({ value: it.id, name: it.name }));
    const sizesOptions = value?.sizes?.map((it: any) => ({ value: it.id, name: it.name }));
    const colorsOptions = value?.colors?.map((it: any) => ({ value: it.id, name: it.name }));


    return { brandOptions, genderOptions, categoryOptions, sizesOptions, colorsOptions };
  }, [value]);

  const baseImage = useMemo(() => {
    if(values) {
      //@ts-ignore
      return values?.images.find(it => it.is_primary)?.image_url;
    }
  }, [values]);

  const onChangeField = (index: number, key: string, v: any) => {
    const currentVariants = fields?.variants?.value || [];
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
    }
    fields.variants.onChange([ ...values.variants, newVariant])
  }

  return (
    <div className='grid grid-cols-12 gap-2'>
      <div className='col-span-6 border rounded-lg p-4'>
        <FormField label={'Name'} error={false} className={'col-span-5'} labelClassName='!font-light'>
          <TextInput
            {...fields.name}
            className="w-full"
            placeholder={'Name'}
            hasError={Boolean(errors.name)}
          />
        </FormField>

        <FormField label={'Description'} error={false} className={'col-span-5'} labelClassName='!font-light'>
          <TextInput
            {...fields.description}
            className="w-full"
            multiline
            placeholder={'Description'}
            hasError={Boolean(errors.description)}
          />
        </FormField>
        <FormField label={'Price'} error={false} className={'col-span-5'} labelClassName='!font-light'>
          <PriceInput
            {...fields.price}
            className="w-1/3"
            placeholder={'Description'}
            hasError={Boolean(errors.description)}
          />
        </FormField>
        <div className='flex flex-row justify-between gap-2'>
          <FormField label={'Category'} error={false} className='w-1/3' labelClassName='!font-light'>
            <SelectInput
              className='w-full'
              value={values.category_id}
              onChange={(v) => fields.category_id.onChange(v)}
              options={categoryOptions}
              placeholder={'Category'}
            />
          </FormField>
          <FormField label={'Brand'} error={false} className='w-1/3' labelClassName='!font-light'>
            <SelectInput
              className='w-full'
              value={values.brand_id}
              onChange={(v) => fields.brand_id.onChange(v)}
              options={brandOptions}
              placeholder={'Brand'}
            />
          </FormField>
          <FormField label={'Gender'} error={false} className='w-1/3' labelClassName='!font-light'>
            <SelectInput
              className='w-full'
              value={values.gender_id}
              onChange={(v) => fields.gender_id.onChange(v)}
              options={genderOptions}
              placeholder={'Gender'}
            />
          </FormField>
        </div>
      </div>

      <div className='col-span-6 bg-gray-50 rounded-lg p-2'>
        <div className='flex flex-row items-center gap-2'>
          <FormField label={'Product Images'} error={false}>
            <img
              //@ts-ignore
              src={baseImage}
              alt={'No Image'}
              loading="lazy"
              className="h-36 w-36 object-cover rounded-lg border transition-transform duration-500 group-hover:scale-105"
            />

          </FormField>
          <div
            onClick={() => {
            }}
            className="flex flex-col items-center mb-1 justify-center w-1/2 h-36 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-all"
          >
            <AiFillPlusCircle size={26} />
            <span className="text-primary mt-1">Upload Image</span>
            <span className="text-gray-500 text-xs mt-1">(.PNG, .JPEG)</span>
          </div>
        </div>
        <div>
          <FormField label={'Variants (Size, Color, Quantity)'} error={false} >
            {values?.variants?.map((variant: any, idx: number) => (
              <div key={idx} className='grid grid-cols-3 gap-2.5'>
                <SelectInput
                  value={variant.size_id}
                  onChange={(v) => onChangeField(idx, 'size_id', v)}
                  options={sizesOptions}
                  placeholder={'Size'}
                  className='w-full'
                  />
                <SelectInput
                  value={variant.color_id}
                  onChange={(v) => onChangeField(idx, 'color_id', v)}
                  options={colorsOptions}
                  placeholder={'Color'}
                  className='w-full'
                  />
                <NumberEditor
                  value={variant.initial_quantity}
                  onChange={(v) => onChangeField(idx, 'initial_quantity', v)}
                  min={1}
                  className='w-full'
                  />
                <div>

                </div>
              </div>
            ))}
            <Button
              type='secondary'
              onClick={onAddNewVariant}
            >
              <AiOutlinePlus size={22} />
              Add Variant
            </Button>
          </FormField>
        </div>
      </div>

    </div>
  )
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
        color_id:'',
        initial_quantity: 0
      }]
    },
    Form: ProductForm,
  };
}


/*
*
{
  "name": "Men's Biker Leather Jacket",
  "description": "Premium black leather biker jacket with a modern slim fit.",
  "price": 129.99,
  "category_id": "CATEGORY_UUID",
  "brand_id": "BRAND_UUID",
  "gender_id": "GENDER_UUID",
  "variants": [
    {
      "size_id": "SIZE_S_UUID",
      "color_id": "BLACK_UUID",
      "initial_quantity": 10
    },
    {
      "size_id": "SIZE_M_UUID",
      "color_id": "BLACK_UUID",
      "initial_quantity": 15
    },
    {
      "size_id": "SIZE_XL_UUID",
      "color_id": "BLACK_UUID",
      "initial_quantity": 8
    },
    {
      "size_id": "SIZE_XXL_UUID",
      "color_id": "BLACK_UUID",
      "initial_quantity": 5
    }
  ],
  "images": [
    {
      "image_url": "https://res.cloudinary.com/example/image/upload/jacket-front.jpg",
      "is_primary": true,
      "display_order": 1
    },
    {
      "image_url": "https://res.cloudinary.com/example/image/upload/jacket-back.jpg",
      "is_primary": false,
      "display_order": 2
    }
  ]
}
*/