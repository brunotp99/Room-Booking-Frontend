import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { defineLocal, isDebugging, urlBase } from '../../utils/Utils';
import { MdDelete } from 'react-icons/md'
import { MdModeEditOutline } from 'react-icons/md'
import { Progress, Empty } from 'antd';
import Swal from 'sweetalert2'
import moment from 'moment'
import EditReserva from '../reservas/editReserva'
import empty from '../../images/empty.svg'

function UltimasReservas() {

  const nestabelecimento = defineLocal()
  const [reservas, setReservas] = useState([{nreserva: '', sala: '', estado: '', horainicio: '', horafim: '', fimreserva: '', cor: 'blue'}])
  const [percentage, setPercentage] = useState(0)

  const loadReservas = () => {

    console.log("Vou atualizar " + new Date())
    let reservas = []

    axios.get(urlBase() + "reservas/ultimas/" + nestabelecimento).then((response) => {
      const data = response.data.data
      data.map(x => {
        var cor = "blue"
        if(x.estadoreserva == 3) cor = "red"
        reservas.push({nreserva: x.nreserva, sala: x.sala.sala, estado: x.sala.nestado, data: x.datareserva, horainicio: x.horainicio, horafim: x.horafim, utilizador: x.utilizadores.utilizador, cor: cor})
      })
      setReservas(reservas)
    }).catch(error => {
      if(isDebugging()) console.log(error)
    })

  }

  const handleDelete = (key, user) => {
    var txt = 'Tem a certeza que pretende remover a reserva do utilizador ' + user + '?'
    Swal.fire({
      title: 'Atenção!',
      text: txt,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
      confirmButtonClass: "swal2-border-radius",
      cancelButtonClass: "swal2-border-radius",
      confirmButtonColor: '#2d63ed',
      cancelButtonColor: '#d33',
      customClass: { popup: "swal2-border-radius",  },
    }).then((result) => {
      if (result.isConfirmed) {
        
        axios.delete(urlBase() + "reservas/remover/" + key)
        .then(res => {
          reloadList()
          Swal.fire({
            title: 'Sucesso!',
            text: 'A reserva foi removida com sucesso!',
            icon: 'success',
            confirmButtonClass: "swal2-border-radius",
            confirmButtonColor: '#2d63ed',
            customClass: { popup: "swal2-border-radius",  },
          })
        }).catch(error => {
          Swal.fire({
            title: 'Atenção!',
            text: 'Não foi possivel remover a reserva!',
            icon: 'error',
            confirmButtonClass: "swal2-border-radius",
            confirmButtonColor: '#2d63ed',
            customClass: { popup: "swal2-border-radius",  },
          })
        })

      }
    })
  };

  useEffect(() => {
    loadReservas()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      loadReservas()
    }, 60000);
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(percentage + 1);
      if(percentage >= 100) setPercentage(0)
    }, 1000);
    return () => clearInterval(interval)
  }, [percentage]);

  const getDate = (data) => {
    return moment(data, "YYYY-MM-DD").format("DD")
  }

  const convertDate = (data) => {
    return moment(data, "YYYY-MM-DD").format("DD/MM")
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
              Não há reservas recentes.
            </span>
          }
        >
        </Empty>
    )
  }

  const [show, setShow] = useState(false)
  const [chave, setChave] = useState("0")

  const handleEdit = (key) => {
    setShow(true)
    setChave(key)
  };

  const callHide = () => {
    setShow(false)
  }

  const reloadList = () => {
    loadReservas()
    setPercentage(0)
  }

  return (
    <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
      <EditReserva show={show} key={chave} id={chave} reloadTable={reloadList} callHide={callHide} />
      <header className="px-5 pt-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Últimas reservas</h2>
        <Progress percent={percentage} status="active" showInfo={false} strokeWidth={3} />
      </header>
      <div className="p-3">

        <div>
          <ul className="my-1">
            {reservas.length != 0 ? reservas.map(item => {
                return (
                  <li className="flex px-2">
                  <div className={"w-9 h-9 rounded-full shrink-0 bg-"+ item.cor +"-400 my-2 mr-3 flex justify-center items-center hidden sm:flex"}>
                      <span className={'text-md fill-current text-blue-50'}>{getDate(item.data)}</span>
                  </div>
                  <div className="grow flex items-center border-b border-slate-100 text-sm py-2">
                    <div className="grow flex justify-between">
                      <div className="self-center">Reserva para {convertDate(item.data)} de <b className="font-medium text-slate-800">{item.utilizador}</b> na <b className="font-medium text-slate-800 hover:text-slate-900">{item.sala}</b><span className='hidden sm:inline'> às <b className="font-medium text-slate-800">{item.horainicio}</b> - <b className="font-medium text-slate-800">{item.horafim}</b> </span> </div>
                      <div className='flex justify-center items-center gap-2'>
                        <button onClick={()=>handleEdit(item.nreserva)} class="transition-all rounded-full px-5 py-2.5 font-medium bg-yellow-50 hover:bg-yellow-500 hover:text-yellow-50 text-yellow-500 rounded-lg text-sm">
                          <MdModeEditOutline />
                        </button>
                        <button onClick={()=>handleDelete(item.nreserva, item.utilizador)} class="transition-all rounded-full px-5 py-2.5 font-medium bg-red-50 hover:bg-red-500 hover:text-red-50 text-red-500 rounded-lg text-sm">
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
                )                
              })
            : <>{emptyLayout()}</>}
          </ul>
        </div>
        
      </div>
    </div>
  );
}

export default UltimasReservas;
