import TextInput from '../../../shared/ui/TextInput';
import FormField from '../../../shared/ui/FormField';
import { useState } from 'react';
import { useBreadcrumbs } from '../../../context/navigation-context';
import Button from '../../../shared/ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import { AppLoader } from '../../../shared/components/AppLoader';
import useForm from '../../../hooks/use-form';
import { useNotify } from '../../../hooks/use-notify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../../context/auth-context';

export function Login() {
  useBreadcrumbs('Login', 1)
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useNotify()
  const [showPassword, setShowPassword] = useState(true);
  const { loading, login } = useAuth();
  const { fields, values } = useForm({
    email: "",
    password: "",
  });

  const onGoToRegister = () => {
    navigate(`${location.pathname.slice(0, 7)}/register`);
  }

  const onLogin = () => {
    login(values.email, values.password).then((data) => {
      if (data) {
        showSuccess("Successfully logged in");
        navigate(
          data.role === "Simple User"
            ? "/public"
            : "/admin",
          { replace: true }
        );
      }
    })
  }



  return (
    <div className='w-full h-full my-24 flex items-center justify-center '>
      {loading && <AppLoader />}
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

        <div className="space-y-5 mb-6">
          <FormField label={'Email Address'} error={false}>
            <TextInput value={values.email} onChange={(v) => fields.email.onChange(v)} />
          </FormField>

          <FormField label={'Password'} error={false}>
            <TextInput value={values.password} onChange={(v) => fields.password.onChange(v)} isTypePassword={showPassword} />
          </FormField>
          <div className="flex flex-row gap-2 justify-start items-center mt-2">
            <label>Show Password</label>
            <div
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className=" text-gray-500 hover:text-black"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>

          </div>
        </div>

        <div>
          <Button
            className="w-full py-3 font-semibold rounded-xl text-white shadow-sm transition-colors duration-200"
            onClick={onLogin}
            type="primary"
            disabled={false}>
            Login
          </Button>
        </div>
        <div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Do not have an account?{' '}
            <div
              onClick={onGoToRegister}
              className="font-semibold text-gray-950 hover:underline hover:cursor-pointer"
            >
              Register Here
            </div>
          </p>
        </div>

      </div>
    </div>

  )
}