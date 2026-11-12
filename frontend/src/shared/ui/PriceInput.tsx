import { useEffect, useState } from 'react';
import classNames from 'classnames';

type PriceInputProps = {
  currency_symbol?: string;
  value?: string;
  onChange?: (value: string) => void; // string-only
  className?: string;
  allowNegative?: boolean;
};

function PriceInput({
                      currency_symbol = '$',
                      value = '',
                      onChange,
                      className,
                      allowNegative = false,
                    }: PriceInputProps) {
  const [text, setText] = useState(value);

  useEffect(() => {
    if (value) {
      setText(value ?? '');
    }
  }, [value]);

  const handleChange = (e: any) => {
    const val = e.target.value;
    const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

    if (regex.test(val) || val === '') {
      setText(val);
      onChange?.(val);
    }
  };

  return (
    <div
      className={classNames(
        'flex items-center rounded-lg border border-gray-300 px-3 py-2 w-full',
        className
      )}
    >
      <span className="mr-2 text-gray-600">{currency_symbol}</span>
      <input
        type="text"
        inputMode="decimal"
        className="w-full outline-none border-none bg-transparent text-gray-900 placeholder-gray-400"
        value={text}
        onChange={handleChange}
      />
    </div>
  );
}

export default PriceInput;