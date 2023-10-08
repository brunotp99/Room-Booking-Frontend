import React, { useEffect, useState } from 'react';

import Sidebar from '../views/Sidebar';
import Header from '../views/Header';
import ReservasMensais from '../views/dashboard/ReservasMensais';
import SalasMaisUtilizadas from '../views/dashboard/SalasMaisUtilizadas';
import UltimasReservas from '../views/dashboard/UltimasReservas';
import NecessidadeLimpeza from '../views/dashboard/NecessidadeLimpeza';
import RangeReservas from '../views/dashboard/RangeReservas';
import Loading from '../views/actions/Loading'
import { BsFillCalendarCheckFill } from 'react-icons/bs';
import { BsFillCalendarXFill } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import { MdChair } from 'react-icons/md';
import '../css/style.css';
import axios from "axios";
import { defineLocal, urlBase, validateLocal } from '../utils/Utils';
import { useLocation } from 'react-router-dom'

function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const local = defineLocal()
  validateLocal()

  const location = useLocation();
  localStorage.setItem('route', location.pathname)

  const [agendadas, setAgendadas] = useState("0")
  const [canceladas, setCanceladas] = useState("0")
  const [utilizadores, setUtilizadores] = useState("0")
  const [salas, setSalas] = useState("0")

  React.useEffect(() => {
    axios.get(urlBase() + "reservas/count/agendadas/" + local).then((response) => {
      setAgendadas(response.data.data);
    }).catch(error => {
      setAgendadas(0)
    });
    axios.get(urlBase() + "reservas/count/canceladas/" + local).then((response) => {
      setCanceladas(response.data.data);
    }).catch(error => {
      setCanceladas(0)
    });
    axios.get(urlBase() + "algoritmos/count/utilizadores/" + local).then((response) => {
      setUtilizadores(response.data.data);
    }).catch(error => {
      setUtilizadores(0)
    });
    axios.get(urlBase() + "salas/count/salas/" + local).then((response) => {
      setSalas(response.data.data);
    }).catch(error => {
      setSalas(0)

    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          {/* Cards Visão Geral */}
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <h1 className='text-2xl font-bold'>Visão Geral</h1>

            <div className="w-full px-6 py-6 mx-auto">

              <div className="flex flex-wrap -mx-3">
                {/* Card Agendadas */}
                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                <div className="relative flex flex-col min-w-0 break-words bg-white shadow-lg rounded-2xl bg-clip-border">
                  <div className="flex-auto p-4">
                    <div className="flex flex-row -mx-3">
                      <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                          <p className="mb-1 leading-normal text-size-sm">Agendadas</p>
                          <h5 className="mb-0 text-2xl font-bold">
                            {agendadas}
                          </h5>
                        </div>
                      </div>
                      <div className="px-3 text-right basis-1/3 flex justify-end">
                        <div className="inline-block w-12 h-12 text-center rounded-lg green-gradient flex justify-center items-center">
                          <BsFillCalendarCheckFill className="text-size-lg relative text-white text-center" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Canceladas */}
              <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                <div className="relative flex flex-col min-w-0 break-words bg-white shadow-lg rounded-2xl bg-clip-border">
                  <div className="flex-auto p-4">
                    <div className="flex flex-row -mx-3">
                      <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                          <p className="mb-1 leading-normal text-size-sm">Canceladas</p>
                          <h5 className="mb-0 text-2xl font-bold">
                            {canceladas}
                          </h5>
                        </div>
                      </div>
                      <div className="px-3 text-right basis-1/3 flex justify-end">
                        <div className="inline-block w-12 h-12 text-center rounded-lg red-gradient flex justify-center items-center">
                          <BsFillCalendarXFill className="text-size-lg relative text-white text-center" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Utilizadores */}
              <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                <div className="relative flex flex-col min-w-0 break-words bg-white shadow-lg rounded-2xl bg-clip-border">
                  <div className="flex-auto p-4">
                    <div className="flex flex-row -mx-3">
                      <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                          <p className="mb-1 leading-normal text-size-sm">Utilizadores</p>
                          <h5 className="mb-0 text-2xl font-bold">
                            {utilizadores}
                          </h5>
                        </div>
                      </div>
                      <div className="px-3 text-right basis-1/3 flex justify-end">
                        <div className="inline-block w-12 h-12 text-center rounded-lg blue-gradient flex justify-center items-center">
                          <FaUserAlt className="text-size-lg relative text-white text-center" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Salas */}
              <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                <div className="relative flex flex-col min-w-0 break-words bg-white shadow-lg rounded-2xl bg-clip-border">
                  <div className="flex-auto p-4">
                    <div className="flex flex-row -mx-3">
                      <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                          <p className="mb-1 leading-normal text-size-sm">Salas</p>
                          <h5 className="mb-0 text-2xl font-bold">
                            {salas}
                          </h5>
                        </div>
                      </div>
                      <div className="px-3 text-right basis-1/3 flex justify-end">
                        <div className="inline-block w-12 h-12 text-center rounded-lg yellow-gradient flex justify-center items-center">
                          <MdChair className="chair text-size-lg relative text-white text-center" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Estatisticas */}

          <h1 className='text-2xl font-bold py-3'>Estatísticas</h1>

          {/* Graficos */}
          <div className="grid grid-cols-12 gap-6 p-4">

            {/* Chart (Salas mais reservas) */}
            <SalasMaisUtilizadas />

            {/* Chart (Intervalo de Tempo) */}
            <RangeReservas />

            {/* Bar chart (Reservas Mensais) */}
            <ReservasMensais />

            {/* Realtime Data (Reservas Recentes) */}
            <UltimasReservas />

            {/* Necessidade Limpeza */}
            <NecessidadeLimpeza />

          </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;