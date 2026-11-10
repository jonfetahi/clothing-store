import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import TextInput from './TextInput';

function parseNumber(
  text: string,
  value: number | null,
  min: number | null,
  max: number | null,
  allowNull: boolean
): number | null {
  const val = parseInt(text.replace(/[^\d-]/g, '')); // Fixed global replacement regex flag
  let valInt: number | null = isNaN(val) ? (allowNull ? null : (value ?? 0)) : val;

  if (Number.isInteger(min) && valInt !== null) {
    valInt = Math.max(min as number, valInt);
  }
  if (Number.isInteger(max) && valInt !== null) {
    valInt = Math.min(max as number, valInt);
  }
  return valInt;
}

type Props = {
  value: number | null;
  onChange(event: React.MouseEvent<HTMLInputElement>): void;
  min?: number | null;
  max?: number | null;
  disabled?: boolean;
  inputClassName?: string;
  className?: string;
  sideButtons?: boolean;
  immediate?: boolean;
  allowNull?: boolean;
  allowNegative?: boolean;
}

function NumberEditor({
                        value,
                        onChange,
                        min = null,
                        max = null,
                        disabled = false,
                        inputClassName = '',
                        className = '',
                        sideButtons = true,
                        immediate = true,
                        allowNull = false,
                        allowNegative = false,
                      }: Props) {
  const [text, setText] = useState<string>(value?.toString() ?? '');

  const [prev, setPrev] = useState<number | null>(value);

  const minValue = Number.isInteger(min) ? min : allowNegative ? null : 0;

  const onChangeValue = () => {
    const valInt = parseNumber(
      text,
      value,
      minValue,
      max,
      allowNull,
    );
    if (value !== valInt) {
      //@ts-ignore
      onChange(valInt);
    }
    setText(valInt !== null ? valInt.toString() : '');
  };

  useEffect(() => {
    if (value !== prev) {
      const txt = value?.toString() ?? '';
      setPrev(value);
      setText(txt);
    }
  }, [prev, value]);

  const canIncrease =
    !disabled && value !== null && (max === null || !Number.isInteger(max) || value < max);
  const canDecrease =
    !disabled && value !== null && (minValue === null || value > minValue);

  const onAdjust = useCallback(
    (sign: number) => {
      if (value === null) return;
      let newValue: number | null = value + sign;
      if (Number.isNaN(newValue)) {
        newValue = sign > 0 ? 1 : 0;
      }
      //@ts-ignore

      onChange(newValue);
      setText(newValue.toString());
    },
    [onChange, value]
  );

  return (
    <div
      className={classNames(
        'inline-flex h-10 items-center rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden',
        disabled && 'bg-gray-50 opacity-60',
        className
      )}
    >
      {sideButtons && (
        <button
          type="button"
          disabled={!canDecrease}
          className={classNames(
            'flex h-full w-10 items-center justify-center transition-colors',
            canDecrease
              ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
              : 'cursor-not-allowed text-gray-300'
          )}
          onClick={() => onAdjust(-1)}
        >
          <AiOutlineMinus size={15} />
        </button>
      )}

      <TextInput
        className="w-14 py-2 !shadow-none !border-0 justify-center text-lg"
        inputClassName={classNames(
          'w-14 !bg-transparent !px-1 text-center font-medium text-gray-800 focus:!ring-0',
          inputClassName
        )}
        value={text}
        onChange={(v: string) => {
          const val = v.replace(/[^0-9.-]/g, '');
          setText(val);

          if (immediate) {
            //@ts-ignore
            onChange(parseNumber(val, value, min, max, allowNull));
          }
        }}
        //@ts-ignore
        onBlur={onChangeValue}
        center
        disabled={disabled}
      />

      {sideButtons && (
        <button
          type="button"
          disabled={!canIncrease}
          className={classNames(
            'flex h-full w-10 items-center justify-center transition-colors',
            canIncrease
              ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
              : 'cursor-not-allowed text-gray-300'
          )}
          onClick={() => onAdjust(1)}
        >
          <AiOutlinePlus size={15} />
        </button>
      )}
    </div>
  );
}

export default NumberEditor;
