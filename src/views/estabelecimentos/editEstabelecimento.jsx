import React, {useContext, useEffect, useState, Fragment } from 'react'
import { Dialog, Transition, Switch } from '@headlessui/react'
import axios from 'axios'
import { insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import '../tables/styles.css'
import Swal from 'sweetalert2'

export function EditEstabelecimento({
  show,
  id,
  reloadTable,
  callHide
}) {

  let [isOpen, setIsOpen] = useState(false)
  const [estabelecimento, setEstabelecimento] = useState("")
  const [localidade, setLocalidade] = useState("")

  let status = show

  const getSala = () => {
    axios.get(urlBase() + "estabelecimentos/get/" + id)
      .then(res => {
          const dados = res.data.data

          if(dados != null){
            setEstabelecimento(dados.estabelecimento)
            setLocalidade(dados.localidade)
          }

      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  useEffect(() => {
    getSala()
    if (status == true) {
      setIsOpen(show)
      status = false
      callHide()
    }
  }, [show])

  function closeModal() {
    setIsOpen(false)
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
                    Alterar Estabelecimento
                  </Dialog.Title>
                    <div className="mt-2">
                      <form>
                          <div className="grid gap-6 mb-6 xs:grid-cols-2">
                              <div>
                                <label htmlFor="estabelecimento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Estabelecimento *</label>
                                <input value={estabelecimento} onChange={value=>setEstabelecimento(value.target.value)} type="text" id="estabelecimento" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Softinsa Viseu" required />
                              </div>
                              <div>
                                <label htmlFor="localidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Localidade *</label>
                                <input value={localidade} onChange={value=>setLocalidade(value.target.value)} type="text" id="localidade" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viseu" required />
                              </div>
                          </div>
                          <hr className='my-3'/>
                          <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-xs font-medium text-gray-900 dark:text-black-300">* Campos obrigatórios</label>
                          </div>
                          <button onClick={(e)=>editEstabelecimento(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Alterar</button> {/* onClick={closeModal} */}
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

  function editEstabelecimento(e){

    if(estabelecimento == "" || localidade == ""){
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
      estabelecimento: estabelecimento,
      localidade: localidade
    }

    axios.put(urlBase() + "estabelecimentos/atualizar/estabelecimento/" + id, datapost)
      .then(res => {
          closeModal()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'O estabelecimento foi atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          reloadTable()
          insertLogs('estabelecimento', 'edit', estabelecimento)
          window.location.reload(false)
      }).catch(error => {
        if(isDebugging()) console.log(error)
        closeModal()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Atenção!',
          text: 'Não foi possível atualizar o estabelecimento!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      })
    e.preventDefault()
  }
}

export default EditEstabelecimento
