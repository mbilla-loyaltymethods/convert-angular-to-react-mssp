import React, { useState } from 'react';
import RichTextEditor from '../Editor/Editor';
import { Descendant } from 'slate';
import { useFormService, FormData, FormField } from '../../services/form/formService';
import { useAlert } from '../../services/alert/alertService';
import { CustomElement } from '../Editor/types';
import { useDispatch } from 'react-redux';
import { saveForm } from '../../store/actions/formActions';

const FormBuilder: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editorContent, setEditorContent] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const formService = useFormService();
  const { showSuccess, showError } = useAlert();
  const dispatch = useDispatch();

  const extractFormFields = (content: Descendant[]): FormField[] => {
    const fields: FormField[] = [];
    
    content.forEach((node) => {
      if ('type' in node && node.type === 'form-field') {
        const fieldNode = node as CustomElement;
        fields.push({
          type: fieldNode.type,
          label: fieldNode.label || '',
          fieldType: fieldNode.fieldType || 'text',
          placeholder: fieldNode.placeholder,
          required: fieldNode.required || false,
          options: fieldNode.options,
        });
      }
    });

    return fields;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const fields = extractFormFields(editorContent);
      
      if (fields.length === 0) {
        showError('Please add at least one form field');
        return;
      }

      const formData: FormData = {
        title,
        description,
        fields,
      };

      await formService.createForm(formData);
      showSuccess('Form created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setEditorContent([
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ]);
    } catch (error) {
      showError('Error creating form. Saving form data locally...');
      console.error('Error creating form:', error);
      
      // Save form data in store
      const fields = extractFormFields(editorContent);
      const formData: FormData = {
        title,
        description,
        fields,
      };
      dispatch(saveForm(formData));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Form Builder</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Form Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Fields
          </label>
          <div className="border rounded-lg">
            <RichTextEditor
              initialValue={editorContent}
              onChange={setEditorContent}
              placeholder="Add form fields using the buttons above..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder; 