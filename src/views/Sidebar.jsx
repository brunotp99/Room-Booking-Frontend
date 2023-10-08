import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdSpaceDashboard } from 'react-icons/md';
import { BsFillCalendarWeekFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { MdChair } from 'react-icons/md';
import { MdLocationPin } from 'react-icons/md';
import { BsFillTabletFill } from 'react-icons/bs';
import { BsTable } from 'react-icons/bs'
import { MdMessage } from 'react-icons/md'
import { FaClipboardList } from 'react-icons/fa'

import SidebarLinkGroup from './SidebarLinkGroup';
import LogoGrande from '../images/softinsa-logo.png'
import '../css/style.css';
import isAdmin from './hooks/isAdmin';

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const [role, setRole] = useState(isAdmin())

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden="true"></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}
      >

        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Fechar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block xl:mx-auto">
            <svg className="esconde text-center" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="150" height="30" viewBox="0 0 150 30">
              <image y="3" width="150" height="23" xlinkHref="data:img/png;base64,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"/>
            </svg>
            <svg className="2xl:hidden" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="45" height="45" viewBox="0 0 60 48">
              <image width="45" height="44" xlinkHref="data:img/png;base64,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"/>
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">•••</span>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname === '/' && 'bg-slate-900'}`}>
                <NavLink end to="/" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname === '/' && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <MdSpaceDashboard className={`icons-menu fill-current text-slate-600 ${pathname === '/' && '!text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Dashboard</span>
                  </div>
                </NavLink>
              </li>
              {/* Calendario */}
              <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname.includes('calendario') && 'bg-slate-900'}`}>
                <NavLink end to="/calendario" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('calendario') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <BsFillCalendarWeekFill className={`icons-menu fill-current text-slate-600 ${pathname.includes('calendario') && 'text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Calendario</span>
                  </div>
                </NavLink>
              </li>
              {/* Reservas */}
              <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname.includes('reservas') && 'bg-slate-900'}`}>
                <NavLink end to="/reservas" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('reservas') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <BsTable className={`icons-menu fill-current text-slate-600 ${pathname.includes('reservas') && 'text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Reservas</span>
                  </div>
                </NavLink>
              </li>
              {/* Utilizadores */}
              <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname.includes('utilizadores') && 'bg-slate-900'}`}>
                <NavLink end to="/utilizadores" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('utilizadores') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <FaUser className={`icons-menu fill-current text-slate-600 ${pathname.includes('utilizadores') && 'text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Utilizadores</span>
                  </div>
                </NavLink>
              </li>          
              {/* Salas */}
              <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname.includes('salas') && 'bg-slate-900'}`}>
                <NavLink end to="/salas" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('salas') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <MdChair className={`icons-menu fill-current text-slate-600 ${pathname.includes('salas') && 'text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Salas</span>
                  </div>
                </NavLink>
              </li>     
              {/* Estabelecimentos */}
              <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname.includes('estabelecimentos') && 'bg-slate-900'}`}>
                <NavLink end to="/estabelecimentos" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('estabelecimentos') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <MdLocationPin className={`icons-menu fill-current text-slate-600 ${pathname.includes('estabelecimentos') && 'text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Estabelecimentos</span>
                  </div>
                </NavLink>
              </li>  
              {/* Dispositivos */}
              <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname.includes('dispositivos') && 'bg-slate-900'}`}>
                <NavLink end to="/dispositivos" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('dispositivos') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <BsFillTabletFill className={`icons-menu fill-current text-slate-600 ${pathname.includes('dispositivos') && 'text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Dispositivos</span>
                  </div>
                </NavLink>
              </li>
              {/* Pedidos */}
              <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname.includes('pedidos') && 'bg-slate-900'}`}>
                <NavLink end to="/pedidos" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('pedidos') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <FaClipboardList className={`icons-menu fill-current text-slate-600 ${pathname.includes('pedidos') && 'text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Pedidos</span>
                  </div>
                </NavLink>
              </li> 
              {
                role ? 
                <li className={`px-3 py-2 rounded-md mb-0.5 last:mb-0 ${pathname.includes('logs') && 'bg-slate-900'}`}>
                <NavLink end to="/logs" className={`block text-slate-200 hover:text-white truncate transition duration-150 ${pathname.includes('logs') && 'hover:text-slate-200'}`}>
                  <div className="flex items-center">
                    <span className="shrink-0 h-5 w-6">
                      <MdMessage className={`icons-menu fill-current text-slate-600 ${pathname.includes('logs') && 'text-indigo-500 icon-selected'}`} />
                    </span>
                    <span className="p-1 text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Logs</span>
                  </div>
                </NavLink>
              </li> : <></>
              }           
            </ul>
          </div>
        </div>
        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Abrir / Fechar Sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;