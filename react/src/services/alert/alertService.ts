import { useCallback } from 'react';

export const useAlert = () => {
  const showSuccess = useCallback((message: string) => {
    // In a real application, you would use a toast or snackbar component here
    console.log('Success:', message);
  }, []);

  const showError = useCallback((message: string) => {
    // In a real application, you would use a toast or snackbar component here
    console.error('Error:', message);
  }, []);

  const showInfo = useCallback((message: string) => {
    // In a real application, you would use a toast or snackbar component here
    console.info('Info:', message);
  }, []);

  const showWarning = useCallback((message: string) => {
    // In a real application, you would use a toast or snackbar component here
    console.warn('Warning:', message);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
}; 