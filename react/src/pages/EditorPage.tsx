import React, { useState } from 'react';
import RichTextEditor from '../components/Editor/Editor';
import { Descendant } from 'slate';

const EditorPage: React.FC = () => {
  const [editorContent, setEditorContent] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: 'Start writing your content here...' }],
    },
  ]);

  const handleEditorChange = (newValue: Descendant[]) => {
    setEditorContent(newValue);
    // You can save the content to your backend here
    console.log('Editor content:', newValue);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Rich Text Editor</h1>
      <div className="max-w-4xl mx-auto">
        <RichTextEditor
          initialValue={editorContent}
          onChange={handleEditorChange}
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
};

export default EditorPage; 