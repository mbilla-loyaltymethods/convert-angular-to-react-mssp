import React, { useMemo, useState } from 'react';
import { createEditor, Descendant, Editor, Transforms, Text, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { CustomElement, CustomText, FormFieldType } from './types';

// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor: Editor) {
    const [match] = Array.from(Editor.nodes(editor, {
      match: (n: any) => 'bold' in n && n.bold === true,
      universal: true,
    }));
    return !!match;
  },

  isCodeBlockActive(editor: Editor) {
    const [match] = Array.from(Editor.nodes(editor, {
      match: (n: any) => SlateElement.isElement(n) && n.type === 'code',
    }));
    return !!match;
  },

  toggleBoldMark(editor: Editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: Text.isText, split: true }
    );
  },

  toggleCodeBlock(editor: Editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes<CustomElement>(
      editor,
      { type: isActive ? 'paragraph' : 'code' },
      { match: (n): n is CustomElement => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
    );
  },

  insertFormField(editor: Editor, fieldType: FormFieldType) {
    const field: CustomElement = {
      type: 'form-field',
      fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Label`,
      placeholder: `Enter ${fieldType}...`,
      children: [{ text: '' }],
      required: false,
      ...(fieldType === 'select' && { options: ['Option 1', 'Option 2', 'Option 3'] }),
      ...(fieldType === 'radio' && { options: ['Radio 1', 'Radio 2', 'Radio 3'] }),
      ...(fieldType === 'textarea' && { rows: 4 }),
      ...(fieldType === 'range' && { min: 0, max: 100, step: 1 }),
      ...(fieldType === 'file' && { accept: 'image/*' })
    };
    
    Transforms.insertNodes(editor, field);
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }],
    });
  },
};

// Define a React component to render leaves with bold formatting.
const Leaf = ({ attributes, children, leaf }: { attributes: any; children: any; leaf: CustomText }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  return <span {...attributes}>{children}</span>;
};

// Define a React component to render elements with different formatting.
const ElementComponent = ({ attributes, children, element }: { attributes: any; children: any; element: CustomElement }) => {
  const commonClasses = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const labelClasses = "block text-gray-700 text-sm font-bold mb-2";

  switch (element.type) {
    case 'code':
      return (
        <pre {...attributes} className="bg-gray-100 p-2 rounded">
          <code>{children}</code>
        </pre>
      );
    case 'form-field':
      switch (element.fieldType) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'tel':
        case 'url':
        case 'search':
          return (
            <div {...attributes} className="mb-4">
              <label className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={element.fieldType}
                className={commonClasses}
                placeholder={element.placeholder}
                required={element.required}
                contentEditable={false}
              />
              {children}
            </div>
          );

        case 'textarea':
          return (
            <div {...attributes} className="mb-4">
              <label className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                className={commonClasses}
                placeholder={element.placeholder}
                rows={element.rows}
                required={element.required}
                contentEditable={false}
              />
              {children}
            </div>
          );

        case 'select':
          return (
            <div {...attributes} className="mb-4">
              <label className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select 
                className={commonClasses}
                required={element.required}
                contentEditable={false}
              >
                <option value="">Select an option</option>
                {element.options?.map((option: string, index: number) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {children}
            </div>
          );

        case 'checkbox':
          return (
            <div {...attributes} className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  required={element.required}
                  contentEditable={false}
                />
                <span className="ml-2 text-gray-700">
                  {element.label}
                  {element.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </label>
              {children}
            </div>
          );

        case 'radio':
          return (
            <div {...attributes} className="mb-4">
              <label className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="mt-2 space-y-2">
                {element.options?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={`radio-${element.label}`}
                      className="form-radio h-4 w-4 text-blue-600"
                      value={option}
                      required={element.required}
                      contentEditable={false}
                    />
                    <span className="ml-2 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {children}
            </div>
          );

        case 'date':
        case 'time':
        case 'datetime-local':
          return (
            <div {...attributes} className="mb-4">
              <label className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={element.fieldType}
                className={commonClasses}
                required={element.required}
                contentEditable={false}
              />
              {children}
            </div>
          );

        case 'file':
          return (
            <div {...attributes} className="mb-4">
              <label className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept={element.accept}
                required={element.required}
                multiple={element.multiple}
                contentEditable={false}
              />
              {children}
            </div>
          );

        case 'color':
          return (
            <div {...attributes} className="mb-4">
              <label className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="color"
                className="h-10 w-20"
                required={element.required}
                contentEditable={false}
              />
              {children}
            </div>
          );

        case 'range':
          return (
            <div {...attributes} className="mb-4">
              <label className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="range"
                className="w-full"
                min={element.min}
                max={element.max}
                step={element.step}
                required={element.required}
                contentEditable={false}
              />
              {children}
            </div>
          );

        default:
          return <p {...attributes}>{children}</p>;
      }
    default:
      return <p {...attributes}>{children}</p>;
  }
};

interface EditorProps {
  initialValue?: Descendant[];
  onChange?: (value: Descendant[]) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<EditorProps> = ({
  initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    } as CustomElement,
  ],
  onChange,
  placeholder = 'Enter some text...',
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const formFields: { type: FormFieldType; label: string }[] = [
    { type: 'text', label: 'Text Input' },
    { type: 'email', label: 'Email' },
    { type: 'password', label: 'Password' },
    { type: 'number', label: 'Number' },
    { type: 'tel', label: 'Phone' },
    { type: 'url', label: 'URL' },
    { type: 'textarea', label: 'Text Area' },
    { type: 'select', label: 'Select' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'radio', label: 'Radio' },
    { type: 'date', label: 'Date' },
    { type: 'time', label: 'Time' },
    { type: 'datetime-local', label: 'DateTime' },
    { type: 'file', label: 'File Upload' },
    { type: 'color', label: 'Color' },
    { type: 'range', label: 'Range' },
    { type: 'search', label: 'Search' },
  ];

  return (
    <div className="border rounded-lg p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleBoldMark(editor);
          }}
        >
          Bold
        </button>
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onMouseDown={(e) => {
            e.preventDefault();
            CustomEditor.toggleCodeBlock(editor);
          }}
        >
          Code Block
        </button>
        {formFields.map((field) => (
          <button
            key={field.type}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onMouseDown={(e) => {
              e.preventDefault();
              CustomEditor.insertFormField(editor, field.type);
            }}
          >
            Add {field.label}
          </button>
        ))}
      </div>
      <Slate
        editor={editor}
        initialValue={value}
        onChange={handleChange}
      >
        <Editable
          className="min-h-[200px] outline-none"
          renderElement={ElementComponent}
          renderLeaf={Leaf}
          placeholder={placeholder}
        />
      </Slate>
    </div>
  );
};

export default RichTextEditor; 