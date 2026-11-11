import { useCallback, useMemo, useState } from 'react';


const defaultValidation = () => ({});

function useForm(
  definition: any,
  validation: (values?: any, extra?: any) => any = defaultValidation,
  extra: object = {},
) {
  const [values, setValues] = useState<any>(definition);
  const [showErrors, setShowErrors] = useState(false);
  const [touched, setTouched] = useState<boolean>(false);

  const fill = useCallback((data: any) => {
    setValues((values: any) => {
      const keys = Object.keys(values);
      const valueList = keys.map((key) => {
        return [key, key in data ? data[key] : values[key]];
      });
      const changes = Object.fromEntries(valueList);
      return { ...values, ...changes };
    });
  }, []);

  const restore = useCallback((data: any) => {
    fill(data);
    setTouched(false);
  }, [fill]);

  const [isValid, errors] = useMemo(() => {
    // @ts-ignore
    const errors = validation(values, extra);
    const isValid = !errors || Object.keys(errors).length === 0;
    return [isValid, showErrors ? errors : {}];
  }, [values, extra, showErrors]);

  const fields = useMemo(() => {
    const fields: any = {};
    for (const [name, value] of Object.entries(values)) {
      fields[name] = {
        name,
        value,
        onChange: (v: any) => {
          setTouched(true);
          fill({ [name]: v?.target ? v?.target.value : v });
        },
        error: (showErrors && errors[name]) || null,
      };
    }
    return fields;
  }, [values, errors, showErrors, fill]);


  return {
    fields,
    values,
    isValid,
    errors,
    restore,
    touched,
    fill,
    showErrors,
    setShowErrors,
  };
}

export default useForm;