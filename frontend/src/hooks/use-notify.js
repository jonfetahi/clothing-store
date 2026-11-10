import { toast } from 'react-toastify';

export const useNotify = () => {
  const defaultOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const showSuccess = (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  };

  const showError = (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  };

  const showWarning = (message, options = {}) => {
    toast.warn(message, { ...defaultOptions, ...options });
  };

  // Handles async functions with loading, success, and error states automatically
  const showPromise = (asyncFunction, messages = { loading: 'Loading...', success: 'Success!', error: 'Failed!' }, options = {}) => {
    return toast.promise(
      asyncFunction,
      messages,
      { ...defaultOptions, ...options }
    );
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showPromise,
    dismissAll: () => toast.dismiss(),
  };
};