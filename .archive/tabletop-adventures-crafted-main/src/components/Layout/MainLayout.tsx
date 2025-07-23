
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import ThemeSwitcher from '../Theme/ThemeSwitcher';

const MainLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <div className="mb-4 flex justify-end">
              <ThemeSwitcher />
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
