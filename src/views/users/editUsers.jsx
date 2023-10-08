import React, {useContext, useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Tabs from './TabsEdit'
import axios from 'axios'
import { insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import './styles.css'
import Swal from 'sweetalert2'
import { Switch as MySwitch } from 'antd';
import authHeader from '../auth/auth-header';
import isAdmin from '../hooks/isAdmin'

export function EditUserModal({
  show,
  id,
  reloadTable,
  callHide
}) {

  let [isOpen, setIsOpen] = useState(false)
  const [remover, setRemover] = useState("")
  const [adicionar, setAdicionar] = useState("")
  const [nome, setNome] = useState("")
  const [apelido, setApelido] = useState("")
  const [cargo, setCargo] = useState("")
  const [telemovel, setTelemovel] = useState("")
  const [email, setEmail] = useState("")
  const [tipo, setTipo] = useState("")
  const [tipoLabel, setTipoLabel] = useState("")
  const [oldtipo, setOldTipo] = useState("")
  const [admin, setAdmin] = useState(0)
  const [adminChanged, setAdminChanged] = useState(0)
  const [disabled, setDisabled] = useState(false)

  const [role, setRole] = useState(isAdmin())

  const isGestor = 0

  let status = show

  const getUser = () => {
    axios.get(urlBase() + "users/table/info/" + id)
      .then(res => {
          const data = res.data.infos
          const dataTipo = res.data.tipo
          if(data.utilizador != null){
            const myArray = data.utilizador.toString().split(" ");
            setNome(myArray[0])
            setApelido(myArray[1])
          }
          setCargo(data.cargo)
          setTelemovel(data.telemovel)
          setEmail(data.email)
          let n = "0"
          if(dataTipo == "Gestor de Espaços") n = "1"
          if(dataTipo == "Funcionário") n = "2"
          if(dataTipo == "Requisintante") n = "3"
          setTipoLabel(dataTipo)
          setTipo(n)
          setOldTipo(n)
      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  const getGrau = () => {
    axios.get(urlBase() + "gestores/get/" + id)
    .then(res => {
        const data = res.data
        if(data.success){
          if(data.data.grau == 1 && role == isGestor){
            setDisabled(true)
          }else setDisabled(false)
          setAdmin(data.data.grau)
          setAdminChanged(data.data.grau)
        }else setAdmin(0)   
    }).catch(error => { 
      if(isDebugging()) console.log(error)
    })
  }

  useEffect(() => {
    getUser()
    getGrau()
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

  const handleAdicionar = (locais) => {
    setAdicionar(locais)
  }

  const handleRemover = (locais) => {
    setRemover(locais)
  }

  const showSelector = () => {

    if(role == 1 && admin == 1){
      return (
        <select onChange={value=>setTipo(value.target.value)} id="countries_multiple" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
          <option value="0" hidden>Gestor Administrador</option>
          <option value="1">Gestor de Espaços</option>
          <option value="2">Funcionário</option>
          <option value="3">Requisitante</option>
          <option value="4">Gestor Administrador</option> 
        </select>
      )
    }else if(role == 1 && admin == 0){
      return (
        <select onChange={value=>setTipo(value.target.value)} id="countries_multiple" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
          <option value="0" hidden>{tipoLabel}</option>
          <option value="1">Gestor de Espaços</option>
          <option value="2">Funcionário</option>
          <option value="3">Requisitante</option>
          <option value="4">Gestor Administrador</option> 
        </select>
      )
    }else{
      return (
      <select onChange={value=>setTipo(value.target.value)} id="countries_multiple" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
        <option value="0" hidden>{tipoLabel}</option>
        <option value="1">Gestor de Espaços</option>
        <option value="2">Funcionário</option>
        <option value="3">Requisitante</option>
      </select> 
      )  
    }
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
                    Alterar Utilizador
                  </Dialog.Title>
                    <div className="mt-2">
                      <form>
                        <div className="grid gap-6 mb-6 xs:grid-cols-2">
                            <div>
                                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Nome *</label>
                                <input value={nome} onChange={value=>setNome(value.target.value)} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Apelido *</label>
                                <input value={apelido} onChange={value=>setApelido(value.target.value)} type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
                            </div>
                            <div>
                                <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Cargo</label>
                                <input value={cargo} onChange={value=>setCargo(value.target.value)} type="text" id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Engenheiro Informático" />
                            </div>  
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Telemóvel</label>
                                <input value={telemovel} onChange={value=>setTelemovel(value.target.value)} type="tel" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="960111222" pattern="[0-9]{3}[0-9]{3}[0-9]{3}" />
                            </div>
                        </div>
                        <div className="mb-6">
                          <label htmlFor="countries_multiple" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-400">Selecione o tipo de utilizador</label>
                          {showSelector()}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="countries_multiple" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-400">Selecione o(s) estabelecimento(s)</label>
                            <Tabs color="black" id={id} add={handleAdicionar} del={handleRemover} />
                        </div> 
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-xs font-medium text-gray-900 dark:text-black-300">* Campos obrigatórios</label>
                        </div>
                        {
                          disabled
                          ? <button type="submit" disabled className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-not-allowed opacity-25" >Alterar</button>  
                          : <button type="submit" onClick={(e)=>editUser(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Alterar</button>  
                        }
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

  function editUser(e){

    if(remover == "erro"){
      Swal.fire({
        title: 'Atenção!',
        text: 'O utilizador tem de estar associado a pelo menos um estabelecimento!',
        icon: 'error',
        confirmButtonClass: "swal2-border-radius",
        confirmButtonColor: '#2d63ed',
        customClass: { popup: "swal2-border-radius",  },
      })
      e.preventDefault()
      return
    }

    if(nome == "" || apelido == "" || email == ""){
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

    if(nome == "" || apelido == "" || email == ""){
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

    var tipoFinal = tipo
    var adminFinal = 0

    if(tipo == "4"){
      adminFinal = 1
      tipoFinal = "1"
    }else setAdmin(0)

    if(oldtipo == tipoFinal && adminFinal == adminChanged) setOldTipo("")
    
    const datapost = {
      nome: nome + " " + apelido,
      cargo: cargo,
      telemovel: telemovel,
      email: email,
      oldtipo: oldtipo,
      tipo: tipoFinal,
      adicionar: adicionar,
      remover: remover,
      grau: adminFinal,
    }

    axios.put(urlBase() + "users/atualizar/" + id, datapost)
      .then(res => {
          closeModal()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'O utilizador foi atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          reloadTable()
          insertLogs('user', 'edit', nome + " " + apelido)
      }).catch(error => {
        if(isDebugging()) console.log(error)
        closeModal()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Atenção!',
          text: 'Não foi possível atualizar o utilizador!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      })
    e.preventDefault()
  }
}

export default EditUserModal
