import React, {useContext, useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiUserAdd } from 'react-icons/hi';
import './styles.css'
import { insertLogs, isDebugging, urlBase } from '../../utils/Utils';
import axios from 'axios'
import Swal from 'sweetalert2'
import { Switch } from 'antd';
import authHeader from '../auth/auth-header';
import { BotaoAddUser } from '../actions/BotaoAdd';

export function AddNewUserModal({
  reloadTable
}) {

  let [isOpen, setIsOpen] = useState(false)
  const [locais, setLocais] = useState([{}])
  const [grau, setGrau] = useState(0)
  const [nome, setNome] = useState("")
  const [apelido, setApelido] = useState("")
  const [cargo, setCargo] = useState("")
  const [telemovel, setTelemovel] = useState("")
  const [email, setEmail] = useState("")
  const [tipo, setTipo] = useState("1")
  const [estabelecimentos, setEstabelecimentos] = useState("")
  const [admin, setAdmin] = useState(0)
  const [emails, setEmails] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const getLocais = () => {
    let locais = []
    axios.get(urlBase() + "estabelecimentos")
      .then(res => {
          const data = res.data.data
          data.map(x => {
            locais.push({id: parseInt(x.nestabelecimento), name: x.estabelecimento})
          })
          setLocais(locais)
      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  const getGestor = () => {
    const user = JSON.parse(localStorage.getItem('auth'));
    if(user){
        const config = {
          headers: authHeader()
        };
        axios.get(urlBase() + "gestores/decoded", config)
        .then(res => {
            const data = res.data.data.grau
            setGrau(data)
        }).catch(error => { 
          if(isDebugging()) console.log(error)
        })
    }
  }

  function getSelectValues(event) {
    let value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setEstabelecimentos(value.join(","))
  }

  useEffect(() => {
    getLocais()
    getGestor()
  }, [])

  const showSelector = () => {
    if(grau == 1){
      return (
        <select onChange={value=>setTipo(value.target.value)} id="countries_multiple" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
          <option value="1">Gestor de Espaços</option>
          <option value="2">Funcionário</option>
          <option value="3">Requisitante</option>
          <option value="4">Gestor Administrador</option> 
        </select>
      )
    }else{
      return (
        <select onChange={value=>setTipo(value.target.value)} id="countries_multiple" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                          
          <option value="1">Gestor de Espaços</option>
          <option value="2">Funcionário</option>
          <option value="3">Requisitante</option>
        </select>
      )
    }
  }

  useEffect(() => {
    getEmails()
  }, [])

  const getEmails = () => {
      const config = {
        headers: authHeader()
      };
      axios.get(urlBase() + "users/emails", config)
        .then(res => {
            const data = res.data.data
            setEmails(data)
            setIsLoading(false)
        }).catch(error => { 
          if(isDebugging()) console.log(error)
        })
  }

  const dupEmails = (email) => {
    var status = false
    emails.forEach(item => {
      if(item.email == email) status = true
    })
    return status
  }



  return (
    <>
      <div className="pt-3 inset-0 flex items-center justify-end">
        {
          isLoading
          ?
          <button type="button" disabled><BotaoAddUser /></button>
          :
          <button type="button" onClick={openModal}><BotaoAddUser /></button>
        }
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
                    Adicionar Utilizador
                  </Dialog.Title>
                    <div className="mt-2">
                      <form>
                        <div className="grid gap-6 mb-6 xs:grid-cols-2">
                            <div>
                                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Nome *</label>
                                <input onChange={value=>setNome(value.target.value)} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nome" required />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Apelido *</label>
                                <input onChange={value=>setApelido(value.target.value)} type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Apelido" required />
                            </div>
                            <div>
                                <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Cargo</label>
                                <input onChange={value=>setCargo(value.target.value)} type="text" id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Engenheiro Informatico" />
                            </div>  
                            <div>
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Telemóvel</label>
                                <input onChange={value=>setTelemovel(value.target.value)} type="tel" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="960111222" pattern="[0-9]{3}[0-9]{3}[0-9]{3}" />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Endereço e-mail *</label>
                            <input onChange={value=>setEmail(value.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nome@sofinsa.pt" required />
                        </div>
                        <div className="mb-6">
                          <label htmlFor="countries_multiple" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-400">Selecione o tipo de utilizador</label>
                          {showSelector()}
                        </div> 
                        <div className="mb-6">
                          <label htmlFor="countries_multiple" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-400">Selecione o(s) estabelecimento(s)</label>
                          <select multiple onChange={(e)=>getSelectValues(e)} id="countries_multiple" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {
                              locais.map((data, index) => {
                                return (<option key={index} value={data.id}>{data.name}</option>)
                              })
                            }
                          </select>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-xs font-medium text-gray-900 dark:text-black-300">* Campos obrigatórios</label>
                        </div>
                        <button onClick={(e)=>registarUtilizador(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Adicionar</button> {/* onClick={closeModal} */}
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

  function registarUtilizador(e){

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
    }else if(dupEmails(email)){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Atenção!',
        text: 'Desculpe, o endereço email introduzido já está associado a um utilizador!',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: "swal2-border-radius" }
      })
      e.preventDefault()
      return
    }

    if(telemovel.length > 9 || telemovel.length < 9){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Atenção!',
        text: 'Por favor, introduza um número de telemovel válido!',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: "swal2-border-radius" }
      })
      e.preventDefault()
      return
    }

    setIsOpen(false)
    const baseUrl = urlBase() + "users/adicionar/single"
    const nomecompleto = nome + " " + apelido
    if(estabelecimentos == ""){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Atenção!',
        text: 'Selecione, pelo menos, um estabelecimento!',
        showConfirmButton: false,
        timer: 2000,
        customClass: { popup: "swal2-border-radius" }
      })
      e.preventDefault()
    }else{

      var adminFinal = 0
      var tipoFinal = tipo

      if(tipo === "4"){
        adminFinal = 1
        tipoFinal = "1"
      }else adminFinal = 0

      const datapost = {
        nome: nomecompleto,
        cargo: cargo,
        telemovel: telemovel,
        email: email,
        tipo: tipoFinal,
        estabelecimentos: estabelecimentos,
        grau: adminFinal
      };
      axios.post(baseUrl, datapost)
      .then((response) => {
        if (response.data.success === true) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'O utilizador foi adicionado com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          reloadTable()
          insertLogs('user', 'create', nomecompleto)
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Atenção!',
            text: 'Não foi possível adicionar o utilizador!',
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
          text: 'Não foi possível adicionar o utilizador!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
        if(isDebugging()) console.log(error)
      }); 
    }
    e.preventDefault()
  }

}

export default AddNewUserModal
