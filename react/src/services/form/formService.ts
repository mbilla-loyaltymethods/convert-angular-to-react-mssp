import { axiosInstance } from '../axios/axiosInstance';

export interface FormField {
  type: string;
  label: string;
  fieldType: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  value?: string | string[] | boolean | number;
}

export interface FormData {
  id?: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt?: string;
  updatedAt?: string;
}

export const useFormService = () => {
  const createForm = async (formData: FormData) => {
    try {
      const response = await axiosInstance.post('/api/v1/forms', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  };

  const getForms = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/forms');
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  };

  const getFormById = async (formId: string) => {
    try {
      const response = await axiosInstance.get(`/api/v1/forms/${formId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  };

  const updateForm = async (formId: string, formData: FormData) => {
    try {
      const response = await axiosInstance.put(`/api/v1/forms/${formId}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating form:', error);
      throw error;
    }
  };

  const deleteForm = async (formId: string) => {
    try {
      await axiosInstance.delete(`/api/v1/forms/${formId}`);
    } catch (error) {
      console.error('Error deleting form:', error);
      throw error;
    }
  };

  const submitFormResponse = async (formId: string, responses: Record<string, any>) => {
    try {
      const response = await axiosInstance.post(`/api/v1/forms/${formId}/responses`, responses);
      return response.data;
    } catch (error) {
      console.error('Error submitting form response:', error);
      throw error;
    }
  };

  return {
    createForm,
    getForms,
    getFormById,
    updateForm,
    deleteForm,
    submitFormResponse,
  };
}; 