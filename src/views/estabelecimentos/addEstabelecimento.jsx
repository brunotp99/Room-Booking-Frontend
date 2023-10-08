import React, {useContext, useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { MdOutlineAdd } from 'react-icons/md'
import '../tables/styles.css'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils';
import axios from 'axios'
import Swal from 'sweetalert2'
import { BotaoAdd } from '../actions/BotaoAdd';
import authHeader from '../auth/auth-header';

export function AddEstabelecimento({
  reloadTable
}) {

  let [isOpen, setIsOpen] = useState(false)

  const [estabelecimento, setEstabelecimento] = useState("")
  const [localidade, setLocalidade] = useState("")
  
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const refreshToken = () => {
    const config = {
      headers: authHeader()
    };
    axios.get(urlBase() + "users/refresh/token", config)
      .then(result => {
        const response = result.data
        if(response.success){
          const accessToken = response?.accessToken;
          const nome = response?.nome;
          const cargo = response?.cargo;
          const imagem = response?.imagem;
          const dataJSON = {accessToken, nome, cargo, imagem}
          localStorage.setItem("auth", JSON.stringify(dataJSON))
          window.location.reload()
        }
      }).catch(error => {
        if(isDebugging()) console.log(error)
      })
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
                    Adicionar Estabelecimento
                  </Dialog.Title>
                    <div className="mt-2">
                      <form>
                        <div className="grid gap-6 mb-6 xs:grid-cols-2">
                            <div>
                              <label htmlFor="estabelecimento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Estabelecimento *</label>
                              <input onChange={value=>setEstabelecimento(value.target.value)} type="text" id="estabelecimento" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Softinsa Viseu" required />
                            </div>
                            <div>
                              <label htmlFor="localidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Localidade *</label>
                              <input onChange={value=>setLocalidade(value.target.value)} type="text" id="localidade" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Viseu" required />
                            </div>
                        </div>
                        <hr className='my-3'/>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-xs font-medium text-gray-900 dark:text-black-300">* Campos obrigatórios</label>
                        </div>
                        <button onClick={(e)=>registarEstabelecimento(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Adicionar</button> {/* onClick={closeModal} */}
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

  function registarEstabelecimento(e){

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

    setIsOpen(false)
    const baseUrl = urlBase() + "estabelecimentos/adicionar"

      const datapost = {
        estabelecimento: estabelecimento,
        localidade: localidade,
      };
      axios.post(baseUrl, datapost)
      .then((response) => {
        if (response.data.success === true) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'O estabelecimento foi adicionado!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          refreshToken()
          insertLogs('estabelecimento', 'create', estabelecimento)
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Atenção!',
            text: 'Não foi possível adicionar o estabelecimento!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
        }
      })
      .catch((error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Atenção!',
          text: 'Não foi possível adicionar o estabelecimento!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
        if(isDebugging()) console.log(error)
      }); 
    e.preventDefault()
  }

}

export default AddEstabelecimento
