import FormField from '../../../../shared/ui/FormField';
import TextInput from '../../../../shared/ui/TextInput';
import SelectInput from '../../../../shared/ui/SelectInput';
import { countries } from '../../../../config/countries';
import { useEffect, useMemo } from 'react';
import { emailRegex } from '../../../../config/regular-expressions';
import { useAuth } from '../../../../context/auth-context';

type Props = {
  values: any;
  errors: any;
  fields: any;
}

export function ShippingInfoForm({ values, fields, errors }: Props) {
  const { user } = useAuth()

  useEffect(() => {
    fields?.first_name.onChange(user?.first_name);
    fields.last_name.onChange(user?.last_name);
    fields.email_address.onChange(user?.email);
  }, []);

  const countryOptions = useMemo(() => {
      return countries.map((country) => ({
        value: country.name,
        name: country.name,
        render: (
          <div className='flex flex-row gap-2 justify-start items-center'>
            <div>
              <img src={country.flag} alt={country.name} className='w-10 h-7 object-cover border border-gray-400 rounded-md'/>
            </div>
            <div className='flex flex-col'>
              <span className='text-base text-primary font-semibold'>{country.name}</span>
              <span className='text-sm text-secondary font-semibold'>{country.code}</span>
            </div>
        </div>
        )
      }));
  }, [countries]);


  return (
    <div className="w-full bg-white space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight text-primary">
          Shipping Information
        </h1>
        <p className="text-sm text-secondary">
          Please enter the shipping information in the form below
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="First Name" error={errors?.first_name}>
            <TextInput
              value={values?.first_name}
              onChange={(v) => fields?.first_name.onChange(v)}
              placeholder={'First Name'}
              hasError={Boolean(errors.first_name)}
            />
          </FormField>

          <FormField label="Last Name" error={errors?.last_name}>
            <TextInput
              value={values?.last_name}
              onChange={(v) => fields.last_name.onChange(v)}
              placeholder={'Last Name'}
              hasError={Boolean(errors.last_name)}
            />
          </FormField>
        </div>

        <FormField label={'Email Address'} error={errors?.email_address}>
          <TextInput
            value={values?.email_address}
            onChange={(v) => fields.email_address.onChange(v)}
            placeholder={'Email Address'}
            hasError={Boolean(errors.email_address)}
          />
        </FormField>
        <FormField label={'Address'} error={errors?.address}>
          <TextInput
            value={values?.address}
            onChange={(v) => fields.address.onChange(v)}
            placeholder={'Address'}
            hasError={Boolean(errors.address)}
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label={'Country'} error={errors?.country}>
            <SelectInput
              value={values?.country}
              onChange={(v) => fields.country.onChange(v)}
              options={countryOptions}
              autocomplete
              placeholder={'Country'}
              hasError={Boolean(errors.country)}
            />
          </FormField>

          <FormField label={'City'} error={errors?.city}>
            <TextInput
              value={values?.city}
              onChange={(v) => fields.city.onChange(v)}
              placeholder={'City'}
              hasError={Boolean(errors.city)}
            />
          </FormField>
          <FormField label={'Postal Code'} error={errors?.postal_code}>
            <TextInput
              value={values?.postal_code}
              onChange={(v) => fields.postal_code.onChange(v)}
              placeholder={'Postal Code'}
              hasError={Boolean(errors.postal_code)}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

const validator = (values: any) => {
  const errors: any = {};
  if (!values.first_name) {
    errors['first_name'] = `First Name is Required`;
  }
  if (!values.last_name) {
    errors['last_name'] = `Last Name is Required`;
  }
  if (!values.email_address) {
    errors['email_address'] = 'Email address is required';
  }
  if (!emailRegex.test(values.email_address)) {
    errors['email_address'] = 'Input is not a valid email address';
  }
  if (!values.city) {
    errors['city'] = 'City is required';
  }
  if (!values.country) {
    errors['country'] = 'Country is required';
  }
  if (!values.postal_code) {
    errors['postal_code'] = 'Postal code is required';
  }
  if (!values.address) {
    errors['address'] = 'Address is required';
  }
  return errors;
};

export function shippingInfoForm() {
  return {
    step_number: 1,
    step: 'Shipping Information',
    label: 'Shipping Information',
    definition: {
      first_name: '',
      last_name: '',
      address: '',
      city: '',
      country: '',
      postal_code: '',
      email_address: '',
    },
    Form: ShippingInfoForm,
    Validator: validator,
  };
}