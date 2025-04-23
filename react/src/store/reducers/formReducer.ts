import { FormData } from '../../services/form/formService';
import { SAVE_FORM, CLEAR_FORM } from '../actions/formActions';

interface FormState {
  formData: FormData | null;
}

const initialState: FormState = {
  formData: null
};

export const formReducer = (state = initialState, action: any): FormState => {
  switch (action.type) {
    case SAVE_FORM:
      return {
        ...state,
        formData: action.payload
      };
    case CLEAR_FORM:
      return {
        ...state,
        formData: null
      };
    default:
      return state;
  }
}; 