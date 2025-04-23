import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'color'
  | 'range'
  | 'search';

export type CustomElement = {
  type: 'paragraph' | 'code' | 'form-field';
  children: CustomText[];
  fieldType?: FormFieldType;
  label?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: number;
  multiple?: boolean;
  rows?: number;
  cols?: number;
  accept?: string;
};

export type CustomText = {
  text: string;
  bold?: boolean;
};

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
} 