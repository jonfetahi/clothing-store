import TextInput from '../../../shared/ui/TextInput';
import FormField from '../../../shared/ui/FormField';
import SelectInput from '../../../shared/ui/SelectInput';
import { useAuth } from '../../../context/auth-context';
import moment from 'moment';

type Props = {
  values: any;
  fields: any;
  errors: any;
}

function UsersForm({ fields, values, errors }: Props) {

  const { isAuthenticated } = useAuth()
  const RoleOptions = [
    { name: 'Admin', value: 'Admin' },
    { name: 'Advanced User', value: 'Advanced User' },
    { name: 'Simple User', value: 'Simple User' },
  ];


  return (
    <div className='grid grid-cols-6 gap-2'>
      <FormField label={'First Name'} error={false} className={'col-span-3'}>
        <TextInput
          {...fields.first_name}
          className="w-full !px-2.5 !py-3"
          disabled={!isAuthenticated}
          hasError={Boolean(errors.first_name)}
        />
      </FormField>
      <FormField label={'Last Name'} error={false} className={'col-span-3'}>
        <TextInput
          {...fields.last_name}
          className="w-full !px-2.5 !py-3"
          placeholder={'Last Name'}
          disabled={!isAuthenticated}
          hasError={Boolean(errors.last_name)}
        />
      </FormField>
      <FormField label={'Email'} error={false} className={'col-span-3'}>
        <TextInput
          {...fields.email}
          className="w-full !px-2.5 !py-3"
          placeholder={'Email Address'}
          disabled={!isAuthenticated}
          hasError={Boolean(errors.email)}
        />
      </FormField>
      <FormField label={'Roles'} error={false} className={'col-span-3'}>
        <SelectInput
          {...fields.role}
          className="w-full"
          placeholder={'Roles'}
          options={RoleOptions}
          selectedLabel
          disabled={!isAuthenticated}
          hasError={Boolean(errors.roles)}
        />
      </FormField>
      <FormField label={'Created At'} error={false} className={'col-span-3'}>
        <TextInput
          value={moment.utc(values.created_at).format('MMMM DD YYYY, HH:mm:ss')}
          onChange={() => {}}
          className="w-full !px-2.5 !py-3"
          placeholder={'Created At'}
          disabled={true}
          hasError={Boolean(errors.email)}
        />
      </FormField>
    </div>
  )
}

export default function usersForm() {
  return {
    definition: {
      first_name: '',
      last_name: '',
      email: '',
      role: '',
      created_at: ''
    },
    Form: UsersForm
  }
}