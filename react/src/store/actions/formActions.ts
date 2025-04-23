import { FormData } from '../../services/form/formService';

export const SAVE_FORM = 'SAVE_FORM';
export const CLEAR_FORM = 'CLEAR_FORM';

export const saveForm = (formData: FormData) => ({
  type: SAVE_FORM,
  payload: formData
});

export const clearForm = () => ({
  type: CLEAR_FORM
}); 