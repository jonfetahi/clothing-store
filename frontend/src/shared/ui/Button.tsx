import { ReactNode, createElement, FC } from 'react';
import classNames, { Argument } from 'classnames';

interface ButtonProps {
  children?: ReactNode;
  type?: 'primary' | 'secondary' | 'warning';
  outline?: boolean;
  small?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: Argument;
  as?: string;
  title?: string;
  onClick: (e?: any) => void;
}

const Button: FC<ButtonProps> = (props: ButtonProps) => {
  const {
    children,
    type,
    outline = false,
    small = false,
    disabled = false,
    active = false,
    className,
    onClick = () => {},
    as = 'button',
    title = null,
    ...rest
  } = props;

  const btnClass = classNames(
    'text-white rounded inline-flex flex-nowrap items-center justify-center leading-4',
    small ? 'py-1 px-2 text-sm' : 'py-2 px-4',
    {
      'bg-black text-white hover:bg-gray-700':
        !disabled && !outline && !active && type === 'primary',
      'bg-gray-200': disabled && !outline && !active && type === 'primary',
      'bg-blue-100 text-blue-500 hover:bg-blue-400 hover:text-white':
        !disabled && !outline && !active && type === 'secondary',
      'bg-blue-50 text-blue-300':
        disabled && !outline && !active && type === 'secondary',
      'bg-red-400 hover:bg-red-600':
        !disabled && !outline && !active && type === 'warning',
      'bg-red-200': disabled && !outline && !active && type === 'warning',
      'border bg-white text-black hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-800 hover:text-blue-500':
        !type,
      'border border-gray-500 hover:border-gray-400':
        !disabled && outline && !active && type === 'primary',
      'border border-blue-200':
        disabled && outline && !active && type === 'primary',
      'border border-blue-400 bg-blue-100 text-blue-500 hover:bg-blue-400 hover:text-white':
        !disabled && outline && !active && type === 'secondary',
      'border border-blue-400 bg-blue-400':
        !disabled && outline && active && type === 'secondary',
      'border border-blue-200 bg-blue-50 text-blue-300':
        disabled && outline && !active && type === 'secondary',
      'border border-red-400 hover:border-red-600':
        !disabled && outline && !active && type === 'warning',
      'border border-red-400':
        disabled && outline && !active && type === 'warning',
      'bg-transparent text-gray-500': outline && !active,
    },
    className
  );

  const disabledOnClick = disabled ? () => {} : onClick;

  return createElement(
    as,
    { ...rest, title, className: btnClass, disabled, onClick: disabledOnClick },
    children
  );
};

export default Button;