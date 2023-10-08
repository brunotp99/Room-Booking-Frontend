import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { MdOutlineAdd } from 'react-icons/md'
import '../tables/styles.css'
import { defineLocal, insertLogs, isDebugging, roundedTime, urlBase } from '../../utils/Utils';
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment-timezone';
import 'moment/locale/pt';
import './styles.css'
import authHeader from '../auth/auth-header';

import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_PT';
import { BotaoAdd } from '../actions/BotaoAdd';

export function AddReserva({
  reloadTable
}) {

  const dateFormat = 'DD/MM/YYYY';
  const timeFormat = 'HH:mm';

  const nestabelecimento = defineLocal()

  let [isOpen, setIsOpen] = useState(false)

  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD')
  }

  const formatTime = (date) => {
    return moment(date).format('HH:mm')
  }

  function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
  }

  const [salas, setSalas] = useState([])
  const [sala, setSala] = useState(0)
  const [utilizador, setUtilizador] = useState("")

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const getSalas = () => {
    const temp = []
    axios.get(urlBase() + "salas/estabelecimento/" + nestabelecimento)
      .then(res => {
        const dados = res.data.data
        var set = false
        dados.map(x => {
          if(!set){
            setSala(x.nsala)
            set = true
          }
          temp.push({key: x.nsala, sala: x.sala})
        })
        setSalas(temp)
      }).catch(error => {
        if(isDebugging()) console.log(error)
      })
  }

  useEffect(() => {
    getSalas()
  }, [])


  const user = JSON.parse(localStorage.getItem('auth'));
  if (user) {
    if(utilizador == "") setUtilizador(user.nome)
  }

  const [dataReserva, setDataReserva] = useState(moment(moment(), dateFormat));
  const [horaInicio, setHoraInicio] = useState(moment(roundedTime(moment()), timeFormat));
  const [horaFim, setHoraFim] = useState(moment(roundedTime(moment().add(1, 'hour')), timeFormat));

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
      <div className="pt-3 inset-0 flex items-center justify-end">
        <button type="button" onClick={openModal}><BotaoAdd /></button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div"  onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="text-center text-2xl font-bold leading-6 text-gray-900"
                  >
                    Adicionar Reserva
                  </Dialog.Title>
                    <div className="mt-2">
                      <form id='AntdV2'>
                        <div className="grid gap-6 mb-6 xs:grid-cols-2">
                            <div>
                              <label htmlFor="sala" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Sala</label>
                              <select onChange={value=>setSala(value.target.value)} id="sala" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
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
                              <input value={utilizador} disabled type="text" id="utilizador" className="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" />
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
                        <button onClick={(e)=>validarReserva(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Adicionar</button> {/* onClick={closeModal} */}
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
    e.preventDefault()
    if(formatTime(horaInicio) < "09:00" || formatTime(horaFim) > "20:00"){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Atenção!',
        text: 'Por favor, selecione um horário entre as 09h e as 20h!',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: "swal2-border-radius" }
      })
      return
    }

    const datapost = {
      horainicio: formatTime(horaInicio),
      horafim: formatTime(horaFim),
      datareserva: formatDate(dataReserva),
      nsala: sala,
    }

    axios.post(urlBase() + "reservas/inserir/validar", datapost)
    .then(res => {
        if(res.data.success) addReserva(e)
        else{
          closeModal()
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Atenção!',
            text: 'Desculpe, ' + res.data.message,
            showConfirmButton: false,
            timer: 2500,
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
        text: 'Desculpe, não foi possível atualizar a reserva!',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: "swal2-border-radius" }
      })
    })
    
    e.preventDefault()
  }

  function addReserva(e){

    const datapost = {
      nsala: sala,
      horainicio: formatTime(horaInicio),
      horafim: formatTime(horaFim),
      datareserva: formatDate(dataReserva),
    }
    const config = {
      headers: authHeader()
    };
    axios.post(urlBase() + "reservas/inserir/finalizar", datapost, config)
      .then(res => {
        closeModal()
        if(res.data){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'A reserva foi adicionada com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          reloadTable()
          insertLogs('reserva', 'create', formatDate(dataReserva) + " " + formatTime(horaInicio) + " - " + formatTime(horaFim))
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Atenção!',
            text: 'Por favor, selecione um intervalo de tempo maior!',
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
          text: 'Desculpe, não foi possível adicionar a reserva!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      })
    e.preventDefault()
  }

}

export default AddReserva
