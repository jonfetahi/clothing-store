
import { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useBreadcrumbs } from '../../../context/navigation-context';
import useServices from '../../../hooks/use-service';
import { Services } from '../../../api/services';
import Button from '../../../shared/ui/Button';
import useForm from '../../../hooks/use-form';
import TextInput from '../../../shared/ui/TextInput';
import FormField from '../../../shared/ui/FormField';
import { useNotify } from '../../../hooks/use-notify';

type RegisterForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useNotify()

  useBreadcrumbs('Register', 1)
  const [showPassword, setShowPassword] = useState(true);

  const { fields, values, errors } = useForm({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  }, (values: any ) => {
    const errors = {} as any;
    if (!values['email']) {
      errors['email'] = 'Email field is required';
    }
    if (!values['first_name']) {
      errors['first_name'] = 'First name field is required';
    }
    if (!values['last_name']) {
      errors['last_name'] = 'Last Name field is required';
    }
    if (!values['password']) {
      errors['password'] = 'Password field is required';
    }
  })



  const { loading, requestAsync } = useServices(Services.Auth.register, false);

  const onGoTologin = () => {
    navigate(`${location.pathname.slice(0, 7)}/login`);
  }

  const onRegister = () => {
    const payload = {
      ...values
    }
    requestAsync({ payload }).then((data) => {
      if (data) {
        showSuccess({
          message: data.message ?? "User Registered",
        })
        onGoTologin();
      }
    })
  }


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <Link
          to="/public"
          className="block text-center text-2xl font-black tracking-tight mb-10"
        >
          CLOTHINGSTORE<span className="text-gray-400">.</span>
        </Link>

        <div className="text-center mb-9">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Create an account
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Join us and discover your personal style.
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormField label={'First Name'} error={errors.first_name}>
                <TextInput
                  value={values.first_name}
                  onChange={(v) => fields.first_name.onChange(v)}
                  placeholder={'First Name'}
                  hasError={Boolean(errors.first_name)}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 outline-none focus:border-gray-950 transition"
                />
              </FormField>
            </div>

            <div>
              <FormField label={'Last Name'} error={errors.last_name}>
                <TextInput
                  value={values.last_name}
                  onChange={(v) => fields.last_name.onChange(v)}
                  placeholder={'Last Name'}
                  hasError={Boolean(errors.last_name)}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 outline-none focus:border-gray-950 transition"
                />
              </FormField>
            </div>
          </div>
          <div>
            <FormField label={'Email Address'} error={errors.email}>
              <TextInput
                value={values.email}
                onChange={(v) => fields.email.onChange(v)}
                placeholder={'Email Address'}
                hasError={Boolean(errors.email)}
                className="w-full h-12 px-4 rounded-lg border border-gray-200 outline-none focus:border-gray-950 transition"
              />
            </FormField>
          </div>
          <div>
            <FormField label={'Password'} error={errors.password}>
              <TextInput
                //@ts-ignore
                isTypePassword={showPassword}
                value={values.password}
                onChange={(v) => fields.password.onChange(v)}
                placeholder={'Enter Password'}
                hasError={Boolean(errors.password)}
                className="w-full h-12 px-4 rounded-lg border border-gray-200 outline-none focus:border-gray-950 transition"
              />
              <div className='flex flex-row gap-2 justify-start items-center mt-2'>
                <label>Show Password</label>
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className=" text-gray-500 hover:text-black"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>

              </div>
            </FormField>
          </div>
          <Button
            type={'primary'}
            onClick={onRegister}
            disabled={loading}
            className="w-full h-12 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? (
              'Creating account...'
            ) : (
            <>
              Create Account
              <FiArrowRight />
            </>
          )}
        </Button>
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <div
            onClick={onGoTologin}
            className="font-semibold text-gray-950 hover:underline hover:cursor-pointer"
          >
            Sign in
          </div>
        </p>

        <p className="mt-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Clothing Store.
          All rights reserved.
        </p>
      </div>
    </div>

  );
};
