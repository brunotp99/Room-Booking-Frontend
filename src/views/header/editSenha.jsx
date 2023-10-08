import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import { isDebugging, urlBase } from '../../utils/Utils'
import Swal from 'sweetalert2'
import authHeader from '../auth/auth-header'

export function EditSenha({
  show,
  callHide
}) {

  let [isOpen, setIsOpen] = useState(false)
  const [antiga, setAntiga] = useState("")
  const [firstNova, setFirstNova] = useState("")
  const [secondNova, setSecondNova] = useState("")

  let status = show

  useEffect(() => {
    if (status == true) {
      setIsOpen(show)
      status = false
      callHide()
    }
  }, [show])


  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
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
                    Alterar Palavra-passe
                  </Dialog.Title>
                    <div className="mt-2">
                      <form>
                        <div className="mb-6">
                            <label htmlFor="antiga" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Palavra-passe Atual</label>
                            <input value={antiga} onChange={value=>setAntiga(value.target.value)} type="password" id="antiga" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Palavra-passe Antiga" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="nova" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Nova Palavra-passe</label>
                            <input value={firstNova} onChange={value=>setFirstNova(value.target.value)} type="password" id="nova" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Palavra-passe Nova" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Confirmar Palavra-passe</label>
                            <input value={secondNova} onChange={value=>setSecondNova(value.target.value)} type="password" id="confirmar" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Confirmar Palavra-passe Nova" />
                        </div>
                        <button type="submit" onClick={(e)=>editSenha(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Alterar</button>
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

  function editSenha(e){

    const config = {
      headers: authHeader()
    };
  
    const bodyParameters = {
      antiga: antiga,
      nova: firstNova
    };
    
    if(firstNova == secondNova){
        if(firstNova.length < 6){
          setFirstNova("")
          setSecondNova("")
          Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Atenção!',
              text: 'A palavra-passe introduzida tem menos de 6 caracteres!',
              showConfirmButton: true,
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius" }
            })
            e.preventDefault()
            return
        }
        axios.post(urlBase() + "users/gestor/definir/senha", bodyParameters, config)
        .then(res => {
            if(res.data.success){
                setAntiga("")
                setFirstNova("")
                setSecondNova("")
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Sucesso!',
                    text: res.data.message,
                    showConfirmButton: false,
                    timer: 2000,
                    confirmButtonClass: "swal2-border-radius",
                    confirmButtonColor: '#2d63ed',
                    customClass: { popup: "swal2-border-radius" }
                  })
                closeModal()
            }else{
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Atenção!',
                    text: res.data.message,
                    showConfirmButton: true,
                    confirmButtonClass: "swal2-border-radius",
                    confirmButtonColor: '#2d63ed',
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
            text: 'Não foi possível atualizar a sua palavra-passe!',
            showConfirmButton: true,
            confirmButtonClass: "swal2-border-radius",
            confirmButtonColor: '#2d63ed',
            customClass: { popup: "swal2-border-radius" }
          })
        })
    }else{
        setFirstNova("")
        setSecondNova("")
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Atenção!',
            text: 'As palavra-passes não correspondem!',
            showConfirmButton: true,
            confirmButtonClass: "swal2-border-radius",
            confirmButtonColor: '#2d63ed',
            customClass: { popup: "swal2-border-radius" }
          })
    }

    e.preventDefault()
  }
}

export default EditSenha
