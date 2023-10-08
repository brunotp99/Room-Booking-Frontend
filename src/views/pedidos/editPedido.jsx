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

export function EditPedido({
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
  const [tipologia, setTipologia] = useState("")
  const [estado, setEstado] = useState("")
  const [descricao, setDescricao] = useState("")

  const [dataReserva, setDataReserva] = useState(moment(moment(), dateFormat));
  const [horaInicio, setHoraInicio] = useState(moment(moment(), timeFormat));
  const [horaFim, setHoraFim] = useState(moment(moment(), timeFormat));

  String.prototype.maxLength = function (length) {
    return this.length > length ? this.substring(0, length) : this;
  }

  const nestabelecimento = defineLocal()

  let status = show

  const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD')
  }

  const formatTime = (date) => {
    return moment(date).format('HH:mm')
  }

  const labelTipologia = (tipo) => {
    switch(tipo){
      case 'limpeza': return 'Limpeza'
      case 'manutencao': return 'Manutenção'
      case 'diversos': return 'Diversos'
      default: return 'Indefinido'
    }
  }

  const labelEstado = (tipo) => {
    switch(tipo){
      case 'cancelado': return 'Cancelado'
      case 'aguarda': return 'Aguarda Serviço'
      case 'limpo': return 'Limpa'
      case 'desinfetado': return 'Limpa e Desinfectada'
      case 'concluido': return 'Finalizada'
      case 'atraso': return 'Em atraso'
      default: return 'Indefinido'
    }
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

  const getPedido = () => {
    axios.get(urlBase() + "pedidos/get/" + id)
      .then(res => {
          const dados = res.data.data

          if(dados != null){
            setSala(dados.nsala)
            setSalaLabel(dados.sala.sala)
            
            if(dados.utilizador != null){
              setUtilizador(dados.utilizador.utilizador)
            }else setUtilizador("Não Definido")

            setDataReserva(moment(new Date(dados.data), dateFormat))
            setHoraInicio(moment(new Date(dados.data + " " + dados.horainicio), timeFormat))
            setHoraFim(moment(new Date(dados.data + " " + dados.horafim), timeFormat))
 
            setTipologia(dados.tipo)

            setEstado(dados.terminado)
            setDescricao(dados.descricao)
          }

      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  useEffect(() => {
    getPedido()
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
                    Alterar Pedido
                  </Dialog.Title>
                    <div className="mt-4">
                      <form id='AntdV2'>
                          <div className="grid gap-6 mb-2 xs:grid-cols-2">
                              <div>
                                <label htmlFor="sala" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Sala *</label>
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
                                <label htmlFor="utilizador" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Funcionário</label>
                                <input value={utilizador} disabled type="text" id="utilizador" className="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ana Maria" />
                              </div>
                          </div>
                          <div className="mb-6">
                              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Descrição</label>
                              <textarea value={descricao} onChange={value=>setDescricao(value.target.value)} id="message" rows="4" maxLength={200} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                          </div>
                          <div className="grid gap-6 mb-6 xs:grid-cols-2">
                              <div>
                                <label htmlFor="tipologia" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Serviço *</label>
                                  <select onChange={value=>setTipologia(value.target.value)} id="tipologia" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
                                    <option value={tipologia} hidden>{labelTipologia(tipologia)}</option>
                                    <option value="limpeza">Limpeza</option>
                                    <option value="manutencao">Manutenção</option>
                                    <option value="diversos">Diversos</option>
                                  </select>
                              </div>
                              <div>
                                <label htmlFor="estado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Estado *</label>
                                  <select onChange={value=>setEstado(value.target.value)} id="estado" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
                                    <option value={estado} hidden>{labelEstado(estado)}</option>
                                    <option value="cancelado">Cancelado</option>
                                    <option value="aguarda">Aguarda Serviço</option>
                                    <option value="limpo">Limpa</option>
                                    <option value="desinfetado">Limpa e Desinfetada</option>
                                    <option value="concluido">Finalizada</option>
                                    <option value="atraso">Em atraso</option>
                                  </select>
                              </div>
                          </div>
                          <div className="mb-6">
                              <label htmlFor="data" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Data pedido *</label>
                              <DatePicker locale={locale} onChange={(date, dateString)=>handleData(date, dateString)} value={dataReserva} format={dateFormat} style={{ width: '100%', border: "1px solid #374151", paddingBlock: "10px", borderRadius: "10px", background: "#374151" }} className='text-white' />
                          </div>
                          <div className="grid gap-6 mb-6 xs:grid-cols-2">
                              <div>
                                <label htmlFor="utilizador" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Inicio *</label>
                                <DatePicker locale={locale} picker="time" onChange={(date, dateString)=>handleInicio(date, dateString)} value={horaInicio} format={timeFormat} style={{ width: '100%', border: "1px solid #374151", paddingBlock: "10px", borderRadius: "10px", background: "#374151" }} />
                              </div>
                              <div>
                                <label htmlFor="utilizador" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Fim *</label>
                                <DatePicker locale={locale} picker="time" onChange={(date, dateString)=>handleFim(date, dateString)} value={horaFim} format={timeFormat} style={{ width: '100%', border: "1px solid #374151", paddingBlock: "10px", borderRadius: "10px", background: "#374151" }} />
                              </div>
                          </div>
                          <hr className='my-3'/>
                          <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-xs font-medium text-gray-900 dark:text-black-300">* Campos obrigatórios</label>
                          </div>
                          <button onClick={(e)=>editPedido(e)} className="transition-all text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Alterar</button>
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

  function editPedido(e){

    if(sala == 0 || horaInicio == undefined || horaFim == undefined || dataReserva == undefined){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Atenção!',
        text: 'Por favor, preencha todos os campos obrigatórios!',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: "swal2-border-radius" }
      })
      e.preventDefault()
      return
    }

    const datapost = {
      nsala: sala,
      tipo: tipologia,
      descricao: descricao.toString().maxLength(200),
      horainicio: formatTime(horaInicio),
      horafim: formatTime(horaFim),
      data: formatDate(dataReserva),
      terminado: estado
    }

    axios.put(urlBase() + "pedidos/update/" + id, datapost)
      .then(res => {
          closeModal()
          if(res.data.success){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Sucesso!',
              text: 'O pedido foi atualizado com sucesso!',
              showConfirmButton: false,
              timer: 2000,
              customClass: { popup: "swal2-border-radius" }
            })
            reloadTable()
            insertLogs('pedido', 'edit', salas.find(x => x.key === sala).sala)
          }else{
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Atenção!',
              text: 'Desculpe, não foi póssivel atualizar o pedido!',
              showConfirmButton: false,
              timer: 2000,
              customClass: { popup: "swal2-border-radius" }
            })
            if(isDebugging()) console.log(res.data.message)
          }
      }).catch(error => {
        if(isDebugging()) console.log(error)
        closeModal()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Atenção!',
          text: 'Desculpe, não foi póssivel atualizar o pedido!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      })
    e.preventDefault()
  }
}

export default EditPedido
