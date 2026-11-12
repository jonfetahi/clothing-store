import { HiCheck } from 'react-icons/hi';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { AppLoader } from '../components/AppLoader';

type Props = {
  onSearchText?: any;
  searchTextLength?: number;
  loading?: boolean;
  options?: any
  value: any,
  onChange(value: any): void,
  placeholder?: string;
  multiple?: boolean;
  onlyActive?: boolean,
  clearable?: boolean,
  maxSelect?: number,
  selectedLabel?: string;
  autocomplete?: boolean;
  openUp?: boolean;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  Icon?: any;
  hasError?: boolean;
  wrapSelected?: boolean;
  checkmark?: boolean;
  sortBy?: any;
  onDropdownToggle?: any;
  allowCreate?: boolean;
  code?: boolean;
  getValue?: boolean;
  overModal?: boolean;
  showUnlistedValue?: boolean;
  open?: any;
  debounce?: boolean
  debounceDelay?: number
};

function SelectInput(
  {
    onSearchText,
    searchTextLength = 3,
    loading = false,
    options,
    value,
    onChange,
    placeholder,
    multiple = false,
    onlyActive = false,
    clearable = false,
    maxSelect,
    selectedLabel = 'items selected',
    autocomplete = false,
    openUp = false,
    className,
    inputClassName,
    disabled,
    Icon,
    hasError = false,
    wrapSelected = true,
    checkmark = true,
    sortBy = null,
    onDropdownToggle,
    allowCreate = false,
    code = false,
    getValue = false,
    overModal = false,
    showUnlistedValue = false,
    open: controlledOpen,
    debounce = false,
    debounceDelay = 400
  }: Props) {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const [delayedOpen, setDelayedOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const optionsWithIds = useMemo(() => {
    if (options === null || options === undefined) {
      return [];
    } else {
      return options
        .map((it: any) => ({
          ...it,
          value: it.value !== undefined ? it.value : it.id,
        }))
        .filter((it: any) => !onlyActive || it.active)
        .filter(
          (it: any) =>
            !searchText ||
            it.name?.toLowerCase().includes(searchText.toLowerCase()),
        );
    }
  }, [options, onlyActive, maxSelect, searchText]);

  const sortedOptions = useMemo(() => {
    if (sortBy) {
      return [...optionsWithIds].sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'description') {
          return a.description.localeCompare(b.description);
        } else if (sortBy === 'displayName') {
          return a.displayName.localeCompare(b.displayName);
        }
        return 0;
      });
    } else {
      return optionsWithIds;
    }
  }, [optionsWithIds, sortBy]);

  useEffect(() => {
    if (open) {
      setDelayedOpen(true);
    } else {
      const timeout = setTimeout(() => {
        setDelayedOpen(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useOnClickOutside(ref, () => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    } else if (onDropdownToggle) {
      onDropdownToggle(false);
    }
    setSearchText('');
  });

  const selected = sortedOptions.find((it: any) => it.value === value);
  const fallbackSelected = useMemo(() => {
    if (
      !selected &&
      showUnlistedValue &&
      value !== null &&
      value !== undefined
    ) {
      return {
        name: value.toString(),
        value,
      };
    }
    return selected;
  }, [selected, showUnlistedValue, value]);

  const toggleSelection = useCallback(
    (val: any, e: any) => {
      e?.stopPropagation();
      if (multiple) {
        if (e) setInternalOpen(false);
        const isSelected = value?.includes(val);
        onChange(
          isSelected ? value?.filter((it: any) => it !== val) : [...value, val],
        );
      } else {
        onChange(val);
      }
      setSearchText('');

      if (controlledOpen === undefined) {
        setInternalOpen(false);
      } else {
        onDropdownToggle?.(false);
      }
    },
    [multiple, value, onChange, inputRef, controlledOpen, onDropdownToggle],
  );

  const clearSelection = useCallback(
    (e: any) => {
      e.stopPropagation();
      onChange(multiple ? [] : null);
      if (controlledOpen === undefined) {
        setInternalOpen(false);
      }
      setSearchText('');
    },
    [multiple, onChange, controlledOpen],
  );

  const canSelectMore = useMemo(
    () => (maxSelect ? value?.length < maxSelect : true),
    [value, maxSelect],
  );

  useEffect(() => {
    const executeSearch = () => {
      onSearchText?.(
        searchText.length >= searchTextLength ? searchText.toLowerCase() : '',
      );
    };
    if (debounce) {
      const handler = setTimeout(executeSearch, debounceDelay);
      return () => clearTimeout(handler);
    } else {
      executeSearch();
    }
  }, [searchText, searchTextLength, onSearchText, debounce, debounceDelay]);

  const hasSelection = multiple ? value?.length > 0 : !!fallbackSelected;
  const valueText = multiple
    ? value?.length > 0
      ? value.length + ' ' + selectedLabel
      : undefined
    : autocomplete
      ? fallbackSelected?.name
      : fallbackSelected?.render || fallbackSelected?.name;

  const placeholderText =
    autocomplete && open
      ? 'Type to search...'
      : (valueText ?? placeholder ?? 'Select');

  const handleToggleDropdown = () => {
    const newOpen = !open;
    if (disabled) return;
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onDropdownToggle?.(newOpen);
  };

  const handleInputChange = (e: any) => {
    const newSearchText = e.target.value;
    setSearchText(newSearchText);
    if (allowCreate) {
      const optionExists = sortedOptions.some(
        (option: any) => option.name.toLowerCase() === newSearchText.toLowerCase(),
      );
      if (!optionExists) {
        setSearchText(newSearchText);
      }
    }
  };

  return (
    <div
      className={classNames(overModal ? '' : 'relative w-full', className)}
      ref={ref}
    >
      <div className={classNames(overModal ? '' : 'relative', className)}>
        <div onClick={handleToggleDropdown} className="relative">
          {autocomplete ? (
            <input
              className={classNames(
                inputClassName,
                hasError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100',
                'w-full rounded-lg border bg-white py-2 px-3  text-left text-sm text-gray-800',
                'shadow-sm transition-all duration-150',
                'focus:outline-none focus:ring-4',
                'placeholder:overflow-ellipsis placeholder:text-gray-400',
                hasSelection && !open
                  ? 'placeholder:text-gray-800'
                  : 'placeholder:text-gray-400',
                { 'cursor-pointer': !autocomplete },
                disabled
                  ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                  : 'bg-white',
              )}
              ref={inputRef}
              placeholder={placeholderText}
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={() => {
                if (controlledOpen === undefined) {
                  setInternalOpen(true);
                }
              }}
              disabled={disabled}
            />
          ) : (
            <div
              className={classNames(
                inputClassName,
                hasError
                  ? 'border-red-300'
                  : open
                    ? 'border-blue-500 ring-4 ring-blue-50'
                    : 'border-gray-200',
                'min-h-[42px] w-full rounded-lg border px-3.5 py-2.5',
                'text-left shadow-sm transition-all duration-150',
                'cursor-pointer',
                hasSelection ? 'text-gray-800' : 'text-gray-400',
                disabled
                  ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                  : 'bg-white',
                Icon ? 'flex flex-row items-center gap-2' : '',
              )}
            >
              {Icon && (
                <Icon
                  size={19}
                  className={classNames(
                    'shrink-0',
                    disabled ? 'text-gray-300' : 'text-gray-400',
                  )}
                />
              )}

              {multiple && hasSelection ? (
                <div
                  className={classNames(
                    'flex flex-1 gap-1.5',
                    wrapSelected
                      ? 'flex-wrap'
                      : 'overflow-x-hidden whitespace-nowrap',
                  )}
                >
                  {sortedOptions
                    .filter((it: any) => value?.includes?.(it.value))
                    .map(({ name, code, value }: any) => (
                      <span
                        key={value}
                        className={classNames(
                          'inline-flex items-center gap-1 rounded-md',
                          'border border-gray-200 bg-gray-50',
                          'px-2 py-1 text-xs font-medium text-gray-700',
                          'whitespace-nowrap',
                        )}
                      >
                    <span className="max-w-[150px] ellipsis">
                      {code ? code : name}
                    </span>

                    <span
                      onClick={(e) =>
                        !disabled && toggleSelection(value, e)
                      }
                      className={classNames(
                        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                        'text-gray-400 transition-colors',
                        !disabled &&
                        'cursor-pointer hover:bg-gray-200 hover:text-gray-700',
                      )}
                    >
                      <RiCloseLine size={15} />
                    </span>
                  </span>
                    ))}
                </div>
              ) : (
                <span className="block flex-1 truncate pr-6">
              {placeholderText}
            </span>
              )}
            </div>
          )}

          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        {loading ? (
          <AppLoader size={18} />
        ) : (
          <RiArrowDownSLine
            className={classNames(
              'h-5 w-5 transition-all duration-200',
              open
                ? 'rotate-180 text-gray-700'
                : 'rotate-0 text-gray-400',
            )}
            aria-hidden="true"
          />
        )}
      </span>

          {clearable &&
            (multiple
              ? value.length > 0 && autocomplete
              : fallbackSelected) && (
              <div
                className="absolute inset-y-0 right-8 flex items-center pr-1"
                onClick={clearSelection}
              >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <RiCloseLine className="h-4 w-4" />
            </span>
              </div>
            )}
        </div>

        <div
          key="animated-select"
          className={classNames(
            'absolute z-40 w-fit overflow-auto',
            'max-h-64 rounded-lg border border-gray-100',
            'bg-white py-1.5 text-sm shadow-xl',
            'ring-1 ring-black/[0.03]',
            'transition-all duration-150 ease-out',
            open
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-1 opacity-0',
            openUp ? 'bottom-full mb-1' : 'mt-1',
            overModal ? className : 'w-full',
          )}
        >
          {delayedOpen &&
            (loading ? (
              <div className="flex min-h-[100px] w-full items-center justify-center">
                <AppLoader />
              </div>
            ) : sortedOptions.length !== 0 ? (
              <div className="px-1.5">
                {sortedOptions.map((option: any, idx: number) => {
                  const active =
                    option.value === value ||
                    (multiple && value?.includes?.(option.value));

                  const disable =
                    option.disabled || (!active && !canSelectMore);

                  const onClick = () => {
                    if (disable) return;
                    //@ts-ignore
                    toggleSelection(option.value);
                  };

                  return (
                    <div
                      key={idx}
                      className={classNames(
                        'relative flex min-h-[40px] items-center rounded-md',
                        'py-2 pr-3 transition-colors duration-100',
                        checkmark ? 'pl-9' : 'pl-3',
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : disable
                            ? 'cursor-default text-gray-400'
                            : 'cursor-pointer text-gray-700 hover:bg-gray-50',
                      )}
                      onClick={onClick}
                    >
                      {option.render || (
                        <span
                          className={classNames(
                            'block break-words',
                            active
                              ? 'font-medium text-blue-700'
                              : 'font-normal',
                          )}
                        >
                      {code ? option.code : option.name}
                    </span>
                      )}

                      {checkmark && active && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-blue-600">
                      <HiCheck
                        className="h-4.5 w-4.5"
                        aria-hidden="true"
                      />
                    </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              !allowCreate && (
                <div className="flex min-h-[70px] items-center justify-center px-4 text-sm text-gray-400">
                  {'No Data Found'}
                </div>
              )
            ))}

          {allowCreate &&
            searchText &&
            !sortedOptions.some(
              (option: any) =>
                option.name.toLowerCase() === searchText.toLowerCase(),
            ) && (
              <div
                className="mx-1.5 cursor-pointer rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="block truncate">{searchText}</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default SelectInput;