import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-[110px] pb-8">
        <Outlet />
      </main>
    </div>
  );
}; 