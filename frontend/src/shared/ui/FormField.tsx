import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string;
  labelClassName?: string;
  label: string;
  description?: string;
  children?: React.ReactNode;
  hideErrors?: boolean;
  error: any;
  horizontal?: boolean;
};

function FormField(props: Props) {
  const {
    className,
    labelClassName = 'font-bold',
    label,
    description,
    hideErrors = false,
    error,
    horizontal = false,
    children,
  } = props;

  return (
    <div
      className={classNames(
        'mb-2',
        { 'grid grid-cols-4': horizontal },
        className
      )}
    >
      <label
        className={classNames('block text-gray-900', labelClassName, {
          'mt-2 py-1.5': horizontal,
        })}
      >
        {label}
      </label>
      <div className={classNames({ 'col-span-3': horizontal })}>
        <div className="mt-2">{children}</div>
        {description && (
          <p className="mt-2 text-sm text-gray-400">{description}</p>
        )}
        {!hideErrors && (
          <p
            className={classNames(
              'mt-1 text-sm transition duration-500 transition-colors',
              error ? 'text-red-500 max-w-[12rem]' : 'text-white'
            )}
          >
            {error}&nbsp;
          </p>
        )}
      </div>
    </div>
  );
}

export default FormField;