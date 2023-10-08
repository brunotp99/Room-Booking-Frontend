import React, {useContext, useEffect, useState, Fragment } from 'react'
import { Dialog, Transition, Switch } from '@headlessui/react'
import axios from 'axios'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import '../tables/styles.css'
import Swal from 'sweetalert2'

export function EditDispositivo({
  show,
  id,
  reloadTable,
  callHide
}) {

  let [isOpen, setIsOpen] = useState(false)
  const [salasList, setSalasList] = useState([{}])
  const [sala, setSala] = useState(0)
  const [salaLabel, setSalaLabel] = useState("")
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [codigo, setCodigo] = useState("")

  const nestabelecimento = defineLocal()
  let status = show

  String.prototype.maxLength = function (length) {
    return this.length > length ? this.substring(0, length) : this;
  }

  const getSalas = (key) => {
    let sala = []
    axios.get(urlBase() + "salas/estabelecimento/" + nestabelecimento)
      .then(res => {
          const data = res.data.data
          data.map(x => {
            if(x.nsala == key) setSalaLabel(x.sala)
            sala.push({key: x.nsala, sala: x.sala})
          })
          setSalasList(sala)
      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  const getTablets = () => {
    axios.get(urlBase() + "tablets/get/" + id)
      .then(res => {
          const data = res.data.data

          if(data != null){
            setMarca(data.marca)
            setModelo(data.modelo)
            setSala(data.nsala)
            getSalas(data.nsala)
            setCodigo(data.pin.toString())
          }

      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  useEffect(() => {
    getTablets()
    if (status == true) {
      setIsOpen(show)
      status = false
      callHide()
    }
  }, [show])

  function closeModal() {
    setIsOpen(false)
  }

  const handleNumChange = event => {
    const limit = 4;
    setCodigo(event.target.value.slice(0, limit));
  };

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
                    Alterar Dispositivo
                  </Dialog.Title>
                    <div className="mt-2">
                      <form>
                          <div className="grid gap-6 mb-6 xs:grid-cols-2">
                            <div>
                            <label htmlFor="sala" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Sala *</label>
                              <select onChange={value=>setSala(value.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
                                <option value="0" hidden>{salaLabel}</option>
                                {
                                    salasList.map((data, index) => {
                                        return (<option key={index} value={data.key}>{data.sala}</option>)
                                    })
                                }
                              </select>
                            </div>
                            <div>
                              <label htmlFor="marca" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Marca *</label>
                              <input value={marca} onChange={value=>setMarca(value.target.value)} type="text" id="marca" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Samsung" required />
                            </div>
                          </div>
                          <div className="grid gap-6 mb-6 xs:grid-cols-2">
                              <div>
                                <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Modelo *</label>
                                <input value={modelo} onChange={value=>setModelo(value.target.value)} type="text" id="modelo" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tab 7" required />
                              </div>
                              <div>
                                <label htmlFor="codigo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Código 4 Digitos *</label>
                                <input value={codigo} maxLength={4} onChange={e=>handleNumChange(e)} type="number" pattern="^[0-9]{4}$" id="codigo" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Samsung" required />
                              </div>
                          </div>
                          <hr className='my-3'/>
                          <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-xs font-medium text-gray-900 dark:text-black-300">* Campos obrigatórios</label>
                          </div>
                          <button onClick={(e)=>editTablet(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Alterar</button> {/* onClick={closeModal} */}
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

  function editTablet(e){

    if(marca == "" || modelo == ""){
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
      marca: marca,
      modelo: modelo,
      codigo: parseInt(codigo)
    }

    axios.put(urlBase() + "tablets/atualizar/" + id, datapost)
      .then(res => {
          closeModal()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'O tablet foi atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          reloadTable()
          insertLogs('dispositivo', 'edit', marca + " " + modelo)
      }).catch(error => {
        if(isDebugging()) console.log(error)
        closeModal()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Atenção!',
          text: 'Não foi possível atualizar o tablet!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      })
    e.preventDefault()
  }
}

export default EditDispositivo
