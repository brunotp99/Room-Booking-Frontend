import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { defineLocal, isDebugging, urlBase } from '../../utils/Utils';
import { FaPause } from 'react-icons/fa'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { MdOutlineCleanHands } from 'react-icons/md'
import { Progress, Empty } from 'antd';
import empty from '../../images/empty.svg'

function NecessidadeLimpeza() {

  const nestabelecimento = defineLocal()
  const [reservas, setReservas] = useState([{nreserva: '', sala: '', estado: '', horainicio: '', horafim: '', fimreserva: ''}])
  const [percentage, setPercentage] = useState(0)

  const loadNecessidades = () => {

    let reservas = []

    axios.get(urlBase() + "pedidos/atual/" + nestabelecimento).then((response) => {
      const data = response.data.data
      data.map(x => {
        reservas.push({npedido: x.npedido, sala: x.sala.sala, tipo: x.tipo, estado: x.terminado, horainicio: x.horainicio, horafim: x.horafim})
      })
      setReservas(reservas)
    }).catch(error => {
      if(isDebugging()) console.log(error)
    })

  }
  var status = true
  useEffect(() => {
    if(status){
      loadNecessidades()
      status = false
    }
    const interval = setInterval(() => {
      loadNecessidades()
    }, 60000);
    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(percentage + 1);
      if(percentage >= 100) setPercentage(0)
    }, 600);
    return () => clearInterval(interval)
  }, [percentage]);

  const typeList = (tipo, sala, horafim) => {
    if(tipo == 'limpeza'){
      return (
        <li className="flex px-2">
          <div className="w-9 h-9 rounded-full shrink-0 bg-amber-500 my-2 mr-3 flex justify-center items-center">
            <FaPause className="w-3 h-3 text-center fill-current text-amber-50" />
          </div>
          <div className="grow flex items-center border-b border-slate-100 text-sm py-2">
            <div className="grow flex justify-between">
              <div className="self-center">A <span className="font-medium text-slate-800">{sala}</span> esta a <b className='font-medium text-amber-400 text-slate-800'>aguardar limpeza</b>. Esta termina às <b className='font-medium text-slate-800 hover:text-slate-900'>{horafim}</b></div>
            </div>
          </div>
        </li>)
    }
    else if(tipo == 'manutencao'){
      return (
        <li className="flex px-2">
          <div className="w-9 h-9 rounded-full shrink-0 bg-amber-500 my-2 mr-3 flex justify-center items-center">
            <FaPause className="w-3 h-3 text-center fill-current text-amber-50" />
          </div>
          <div className="grow flex items-center border-b border-slate-100 text-sm py-2">
            <div className="grow flex justify-between">
              <div className="self-center">A <span className="font-medium text-slate-800">{sala}</span> esta a <b className='font-medium text-red-400 text-slate-800'>aguardar manutenção</b>. Esta termina às <b className='font-medium text-slate-800 hover:text-slate-900'>{horafim}</b></div>
            </div>
          </div>
        </li>)
    }
    else if(tipo == 'diversos'){
      return (
        <li className="flex px-2">
          <div className="w-9 h-9 rounded-full shrink-0 bg-amber-500 my-2 mr-3 flex justify-center items-center">
            <FaPause className="w-3 h-3 text-center fill-current text-amber-50" />
          </div>
          <div className="grow flex items-center border-b border-slate-100 text-sm py-2">
            <div className="grow flex justify-between">
              <div className="self-center">A <span className="font-medium text-slate-800">{sala}</span> esta a <b className='font-medium text-slate-400 text-slate-800'>aguardar um serviço</b>. Este termina às <b className='font-medium text-slate-800 hover:text-slate-900'>{horafim}</b></div>
            </div>
          </div>
        </li>)
    }
  }

  const emptyLayout = () => {
    return(
        <Empty
          className='flex flex-col justify-center items-center'
          image={empty}
          imageStyle={{
            height: 60,
          }}
          description={
            <span>
              Não há necessidade de limpeza.
            </span>
          }
        >
        </Empty>
    )
  }

  return (
    <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
      <header className="px-5 pt-5 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Necessidade atual de limpeza</h2>
        <Progress percent={percentage} status="active" showInfo={false} strokeWidth={3} />
      </header>
      <div className="p-3">

        <div>
          <ul className="my-1">
            {/* Item */}
            {reservas.length != 0 ? reservas.map(item => {
                return typeList(item.tipo, item.sala, item.horafim)                 
              })
            : <>{emptyLayout()}</>}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default NecessidadeLimpeza;
