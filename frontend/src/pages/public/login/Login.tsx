import TextInput from '../../../shared/ui/TextInput';
import FormField from '../../../shared/ui/FormField';
import { useState } from 'react';
import { useBreadcrumbs } from '../../../context/navigation-context';
import Button from '../../../shared/ui/Button';

export function Login() {
  useBreadcrumbs('Login', 1)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  return (
    <div className='w-full h-full my-24 flex items-center justify-center '>
      <div
        className='w-full max-w-md rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/60'>
        <div className='text-center pb-8'>
          <h1 className='text-gray-900 font-sans font-bold text-3xl tracking-tight mb-2'>
            Login to Admin
          </h1>
          <p className='text-sm text-gray-500'>
            Enter your credentials to access the portal
          </p>
        </div>

        <div className='space-y-5 mb-6'>
          <FormField label={'Username'} error={false}>
            <TextInput value={username} onChange={(v) => setUsername(v)} />
          </FormField>

          <FormField label={'Password'} error={false}>
            <TextInput value={password} onChange={(v) => setPassword(v)} isTypePassword />
          </FormField>
        </div>

        <div>
          <Button
            className='w-full py-3 font-semibold rounded-xl text-white shadow-sm transition-colors duration-200'
            onClick={() => {
            }}
            type='primary'
            disabled={false}>
            Login
          </Button>
        </div>

      </div>
    </div>

  )
}