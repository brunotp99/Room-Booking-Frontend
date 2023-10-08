import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'
import Sidebar from '../views/Sidebar';
import Header from '../views/Header';
import List from '../views/logs/list'
import { validateLocal } from '../utils/Utils';

function Logs() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  localStorage.setItem('route', location.pathname)

  validateLocal()

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <h1 className='text-2xl font-bold'>Logs</h1>
                <div className='p-2 my-5'>
                    <List />
                </div>
            </div>
        </main>

      </div>
    </div>
  );
}

export default Logs;