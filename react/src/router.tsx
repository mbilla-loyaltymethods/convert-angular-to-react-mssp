import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import EditorPage from './pages/EditorPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="editor" element={<EditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}; 