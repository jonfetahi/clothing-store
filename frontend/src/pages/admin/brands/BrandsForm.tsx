import TextInput from '../../../shared/ui/TextInput';
import FormField from '../../../shared/ui/FormField';

type Props = {
  fields: any;
  values: { [key: string]: string | number | boolean | any[] | object; }
  errors: { [key: string]: string };
}

export function BrandsForm({ fields, values, errors }: Props) {
  return (
    <div className='grid grid-cols-5 '>
      <FormField label={'Name'} error={false} horizontal className={'col-span-5'}>
        <TextInput
          {...fields.name}
          className="w-full"
          placeholder={'Name'}
          hasError={Boolean(errors.name)}
        />
      </FormField>
      <FormField label={'Id'} error={false} horizontal className={'col-span-5'}>
        <TextInput
          {...fields.id}
          className="w-full"
          placeholder={'Unique ID'}
          disabled={values?.id}
          hasError={Boolean(errors.name)}
        />
      </FormField>
    </div>
  )
}

export default function brandsForm() {
  return {
    definition: {
      id: '',
      name: '',
    },
    Form: BrandsForm,
  };
}
