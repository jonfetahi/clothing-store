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
    'text-black rounded inline-flex flex-nowrap items-center justify-center leading-4 transition-colors',
    small ? 'py-1 px-2 text-sm' : 'py-2 px-4',
    {
      // --- PRIMARY ---
      'bg-primary text-white hover:bg-opacity-90':
        !disabled && !outline && !active && type === 'primary',
      'bg-gray-200 text-gray-400 cursor-not-allowed':
        disabled && !outline && !active && type === 'primary',

      // --- SECONDARY ---
      'bg-secondary text-white hover:bg-gray-800':
        !disabled && !outline && !active && type === 'secondary',
      'bg-gray-300 text-gray-400 cursor-not-allowed hover:bg-gray-200':
        disabled && !outline && !active && type === 'secondary',

      // --- WARNING ---
      'bg-red-600 hover:bg-red-500 text-white':
        !disabled && !outline && !active && type === 'warning',
      'bg-red-200 text-red-400':
        disabled && !outline && !active && type === 'warning',

      // --- DEFAULT (No Type / Undefined) ---
      'border bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-gray-400':
        !type && !disabled,
      'border bg-gray-100 border-gray-200 cursor-not-allowed':
        !type && disabled,

      // --- OUTLINE VARIANTS ---
      'border border-gray-500 hover:border-gray-400 text-gray-700':
        !disabled && outline && !active && type === 'primary',
      'border border-gray-300 text-gray-500 bg-transparent':
        outline && !active && !type,
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