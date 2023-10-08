import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import '../tables/styles.css'
import Swal from 'sweetalert2'
import moment from 'moment';
import './styles.css'

import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_PT';

export function EditReserva({
  show,
  id,
  reloadTable,
  callHide
}) {

  const dateFormat = 'DD/MM/YYYY';
  const timeFormat = 'HH:mm';

  let [isOpen, setIsOpen] = useState(false)

  const [sala, setSala] = useState(0)
  const [salaLabel, setSalaLabel] = useState("")
  const [salas, setSalas] = useState([])
  const [utilizador, setUtilizador] = useState("")
  const [intervalo, setIntervalo] = useState(0)
  const [estado, setEstado] = useState(0)

  const [dataReserva, setDataReserva] = useState(moment(moment(), dateFormat));
  const [horaInicio, setHoraInicio] = useState(moment(moment(), timeFormat));
  const [horaFim, setHoraFim] = useState(moment(moment(), timeFormat));

  const nestabelecimento = defineLocal()

  let status = show

  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD')
  }

  const formatTime = (date) => {
    return moment(date).format('HH:mm')
  }

  const getSalas = () => {
    const temp = []
    axios.get(urlBase() + "salas/estabelecimento/" + nestabelecimento)
      .then(res => {
        const dados = res.data.data
        dados.map(x => {
          temp.push({key: x.nsala, sala: x.sala})
        })
        setSalas(temp)
      }).catch(error => {
        if(isDebugging()) console.log(error)
      })
  }

  const getReserva = () => {
    axios.get(urlBase() + "reservas/find/" + id)
      .then(res => {
          const dados = res.data.data

          if(dados != null){
            setSala(dados.sala.nsala)
            setSalaLabel(dados.sala.sala)
            setUtilizador(dados.utilizadores.utilizador)

            setDataReserva(moment(new Date(dados.datareserva), dateFormat))
            setHoraInicio(moment(new Date(dados.datareserva + " " + dados.horainicio), timeFormat))
            setHoraFim(moment(new Date(dados.datareserva + " " + dados.horafim), timeFormat))
 
            setIntervalo(dados.sala.intervalolimpeza)
            setEstado(dados.estadoreserva)
          }

      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  useEffect(() => {
    getReserva()
    if (status == true) {
      setIsOpen(show)
      status = false
      callHide()
    }
  }, [show])

  useEffect(() => {
    getSalas()
  }, [])

  function closeModal() {
    setIsOpen(false)
  }

  const handleData = (date, dateString) => {
    setDataReserva(date)
  }

  const handleInicio = (date, dateString) => {
    setHoraInicio(date)
  }

  const handleFim = (date, dateString) => {
    setHoraFim(date)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 z-index-900" />
          </Transition.Child>

          <div className="flex justify-center items-center overflow-y-hidden sm:overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="max-height w-full max-w-md overflow-auto transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="text-center text-2xl font-bold leading-6 text-gray-900"
                  >
                    Alterar Reserva
                  </Dialog.Title>
                    <div className="mt-2">
                      <form id='AntdV2'>
                          <div className="grid gap-6 mb-6 xs:grid-cols-2">
                              <div>
                                <label htmlFor="sala" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Sala</label>
                                <select onChange={value=>setSala(value.target.value)} id="sala" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
                                  <option value="0" hidden>{salaLabel}</option>
                                  {
                                    salas.map((x, index) => {
                                      return (
                                        <option key={index} value={x.key}>{x.sala}</option>
                                      )
                                    })
                                  }
                                </select>
                              </div>
                              <div>
                                <label htmlFor="utilizador" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Utilizador</label>
                                <input value={utilizador} disabled type="text" id="utilizador" className="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ana Maria" />
                              </div>
                          </div>
                          <div className="mb-6">
                            <label htmlFor="data" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Data reserva</label>
                            <DatePicker locale={locale} onChange={(date, dateString)=>handleData(date, dateString)} value={dataReserva} format={dateFormat} style={{ width: '100%', border: "1px solid #374151", paddingBlock: "10px", borderRadius: "10px", background: "#374151" }} className='text-white' />
                          </div>
                          <div className="grid gap-6 mb-6 xs:grid-cols-2">
                              <div>
                                <label htmlFor="utilizador" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Inicio</label>
                                <DatePicker locale={locale} picker="time" onChange={(date, dateString)=>handleInicio(date, dateString)} value={horaInicio} format={timeFormat} style={{ width: '100%', border: "1px solid #374151", paddingBlock: "10px", borderRadius: "10px", background: "#374151" }} />
                              </div>
                              <div>
                                <label htmlFor="utilizador" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Fim</label>
                                <DatePicker locale={locale} picker="time" onChange={(date, dateString)=>handleFim(date, dateString)} value={horaFim} format={timeFormat} style={{ width: '100%', border: "1px solid #374151", paddingBlock: "10px", borderRadius: "10px", background: "#374151" }} />
                              </div>
                          </div>
                          <hr className='my-3'/>
                          <button onClick={(e)=>validarReserva(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Alterar</button> {/* onClick={closeModal} */}
                        </form>
                    </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )

  function validarReserva(e){

    const datapost = {
      horainicio: formatTime(horaInicio),
      horafim: formatTime(horaFim),
      datareserva: formatDate(dataReserva),
      nsala: sala,
      nreserva: id
    }

    if(estado == 0 || estado == 2){

      var txt = "Tem a certeza que quer alterar uma reserva cancelada?"
      if(estado == 2) txt = "Tem a certeza que quer alterar uma reserva já concluidá?"

      Swal.fire({
        title: 'Atenção',
        text: txt,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonClass: "swal2-border-radius",
        cancelButtonClass: "swal2-border-radius",
        confirmButtonColor: '#2d63ed',
        cancelButtonColor: '#d33',
        customClass: { popup: "swal2-border-radius",  },
        confirmButtonText: 'Continuar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post(urlBase() + "reservas/alterar/validar/" + id, datapost)
          .then(res => {
            if(res.data.success) editReserva(e)
            else{
              closeModal()
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Atenção!',
                text: 'Desculpe, o intervalo que escolheu não esta disponível!',
                showConfirmButton: false,
                timer: 2000,
                customClass: { popup: "swal2-border-radius" }
              })
            }
          }).catch(error => {
            if(isDebugging()) console.log(error)
            closeModal()
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Atenção!',
              text: 'Desculpe, não foi póssivel atualizar a reserva!',
              showConfirmButton: false,
              timer: 2000,
              customClass: { popup: "swal2-border-radius" }
            })
          })
        }
      })

    }else{
      axios.post(urlBase() + "reservas/alterar/validar/" + id, datapost)
      .then(res => {
          if(res.data.success) editReserva(e)
          else{
            closeModal()
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Atenção!',
              text: 'Desculpe, o intervalo que escolheu não esta disponível!',
              showConfirmButton: false,
              timer: 2000,
              customClass: { popup: "swal2-border-radius" }
            })
          }
      }).catch(error => {
        if(isDebugging()) console.log(error)
        closeModal()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Atenção!',
          text: 'Desculpe, não foi póssivel atualizar a reserva!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      })
    }
    e.preventDefault()
  }

  function editReserva(e){

    const datapost = {
      nsala: sala,
      horainicio: formatTime(horaInicio),
      horafim: formatTime(horaFim),
      datareserva: formatDate(dataReserva),
      intervalo: intervalo
    }

    axios.put(urlBase() + "reservas/alterar/finalizar/" + id, datapost)
      .then(res => {
          closeModal()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'A Reserva foi atualizada com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          reloadTable()
          insertLogs('reserva', 'edit', formatDate(dataReserva) + " " + formatTime(horaInicio) + " - " + formatTime(horaFim))
      }).catch(error => {
        if(isDebugging()) console.log(error)
        closeModal()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Atenção!',
          text: 'Desculpe, não foi póssivel atualizar a reserva!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      })
    e.preventDefault()
  }
}

export default EditReserva
