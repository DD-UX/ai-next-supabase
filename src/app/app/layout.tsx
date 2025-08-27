'use client';

import { useState, type PropsWithChildren } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

type AppLayoutProps = PropsWithChildren;

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform',
          {
            'translate-x-0': isSidebarOpen,
            '-translate-x-full': !isSidebarOpen,
          },
          'transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col',
        )}
      >
        <div className="flex items-center justify-center h-16 bg-white border-b">
          <h1 className="text-2xl font-bold text-indigo-600">Dashboard</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md"
          >
            Home
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-gray-700 rounded-md">
            Settings
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between h-16 bg-white border-b md:justify-end">
          <button
            className="px-4 text-gray-500 md:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center pr-4">
            {/* User menu */}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
