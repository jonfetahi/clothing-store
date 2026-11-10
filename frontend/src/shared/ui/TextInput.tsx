import React, { useCallback } from 'react';
import classNames from 'classnames';

interface TextInputProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  hasError?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  Icon?: React.ElementType;
  center?: boolean;
  right?: boolean;
  autoFocus?: boolean;
  isTypePassword?: boolean;
}

function TextInput(props: TextInputProps) {
  const {
    className,
    inputClassName,
    placeholder = '',
    value,
    onChange,
    disabled = false,
    multiline = false,
    rows = 3,
    hasError = false,
    prefix,
    suffix,
    Icon,
    center = false,
    right = false,
    autoFocus = false,
    isTypePassword = false,
  } = props;

  const baseInputClasses = classNames(
    'min-w-0 flex-1 bg-transparent outline-none',
    'text-sm text-gray-800 placeholder:text-gray-400',
    'disabled:cursor-not-allowed disabled:text-gray-400',
    {
      'text-center': center,
      'text-right': right,
      'text-red-600': hasError,
    },
    inputClassName,
  );

  const wrapperClasses = classNames(
    'flex w-full items-center overflow-hidden px-2 py-2 rounded-lg border',
    'bg-white shadow-sm',
    'transition-all duration-150',
    {
      'border-red-300 ring-4 ring-red-50': hasError,
      'border-gray-200': !hasError && !disabled,
      'bg-gray-50 border-gray-200 cursor-not-allowed': disabled,
      'focus-within:border-gray-800 focus-within:ring-4 focus-within:ring-gray-100':
        !hasError && !disabled,
    },
    className,
  );

  const InputElement = multiline ? 'textarea' : 'input';

  const onChangeInternal = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={wrapperClasses}>
      {Icon && (
        <div
          className={classNames(
            'flex shrink-0 items-center pr-3',
            disabled ? 'text-gray-300' : 'text-gray-400',
          )}
        >
          <Icon size={19} />
        </div>
      )}

      {prefix && (
        <div
          className={classNames(
            'flex shrink-0 items-center self-stretch',
            'border-r px-3 text-sm font-medium',
            hasError
              ? 'border-red-200 bg-red-50 text-red-500'
              : 'border-gray-200 bg-gray-50 text-gray-500',
            disabled && 'bg-gray-100 text-gray-400',
          )}
        >
          {prefix}
        </div>
      )}

      <InputElement
        className={baseInputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChangeInternal}
        disabled={disabled}
        autoComplete="off"
        rows={multiline ? rows : undefined}
        autoFocus={autoFocus}
        type={multiline ? undefined : isTypePassword ? 'password' : 'text'}
      />

      {suffix && (
        <div
          className={classNames(
            'flex shrink-0 items-center self-stretch',
            'border-l px-3 text-sm font-medium',
            hasError
              ? 'border-red-200 bg-red-50 text-red-500'
              : 'border-gray-200 bg-gray-50 text-gray-500',
            disabled && 'bg-gray-100 text-gray-400',
          )}
        >
          {suffix}
        </div>
      )}
    </div>
  );
}

export default TextInput;