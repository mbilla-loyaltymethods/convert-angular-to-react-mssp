import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import { Login } from './components/Login/Login';
import { useAuth } from './services/auth/authService';
import { Provider } from 'react-redux';
import { store } from './store';
import EditorPage from './pages/EditorPage';
import FormBuilder from './components/FormBuilder/FormBuilder';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/editor"
              element={
                isAuthenticated ? (
                  <EditorPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/form-builder"
              element={
                isAuthenticated ? (
                  <FormBuilder />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Add more protected routes here */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App; 