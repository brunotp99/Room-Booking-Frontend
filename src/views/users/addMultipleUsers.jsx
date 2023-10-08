import React, {useContext, useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { MdGroupAdd } from 'react-icons/md';
import { insertLogs, isDebugging, urlBase } from '../../utils/Utils';
import axios from 'axios'
import Swal from 'sweetalert2'
import PopUp from './popUp'
import readXlsxFile from 'read-excel-file'
import authHeader from '../auth/auth-header';
import { BotaoAddBulk } from '../actions/BotaoAdd';

export function AddMultiple({
  reloadTable
}) {

  let [isOpen, setIsOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [logs, setLogs] = useState([])
  const [count, setCount] = useState(0)
  const [file, setFile] = useState("")
  const [emails, setEmails] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const dupEmails = (email) => {
    emails.forEach(item => {
      if(item.email == email) return true
    })
    return false
  }
  
  function sendFile(ficheiro){

    let log = []

    readXlsxFile(ficheiro).then((rows) => {
      
      /* Validar o Header */
      log = []
      if(rows[0][0] != 'Utilizador' || rows[0][1] != 'Cargo' || rows[0][2] != 'Telemovel' || rows[0][3] != 'Endereço email' || rows[0][4] != 'Tipo' || rows[0][5] != 'Estabelecimentos'){
        log.push({user: "", email: "", message: "Por favor, não edite o template de importação em bundle!"})
        setLogs(log)
        setCount(1)
        setShow(true)
      }else{
        rows.shift();
        let users = [];
        log = []

        rows.forEach((row) => {
            var utilizador = row[0]
            var cargo = row[1]
            var telemovel = row[2]
            var email = row[3]
            var tipo = row[4]
            var estabelecimentos = row[5]

            if(!validateEmail(email)){
              log.push({user: utilizador, email: email, message: "O endereço email introduzido para o seguinte utilizador é invalido!"})
            }else if(utilizador == undefined || utilizador == "" || utilizador == null){
              log.push({user: utilizador, email: email, message: "O nome do utilizador fornecido não é válido!"})
            }else if(tipo == undefined || tipo == "" || tipo == null){
              log.push({user: utilizador, email: email, message: "Não foi associado nenhum tipo ao seguinte utilizador!"})
            }else if(estabelecimentos == undefined || estabelecimentos == "" || estabelecimentos == null){
              log.push({user: utilizador, email: email, message: "Não foi associado nenhum estabelecimento ao seguinte utilizador!"})
            }else if(dupEmails(email)){
              log.push({user: utilizador, email: email, message: "O email fornecido já está associado a um utilizador!"})
            }else{

                if(cargo == undefined || cargo == "" || cargo == null){
                  cargo = ""
                }

                if(telemovel != null){
                  if(telemovel.toString().length > 9 || telemovel.toString().length < 9)
                    telemovel = ""
                }else{
                  telemovel = ""
                }

                let user = {
                    utilizador: utilizador,
                    cargo: cargo,
                    telemovel: telemovel,
                    email: email,
                    tipo: tipo.toString(),
                    estabelecimentos: estabelecimentos.toString(),
                    verifypassword: 0,
                    estado: 1,
                    imagem: "default.jpg",
                    notify: 1,
                    password: Math.random().toString(36).slice(-8)
                };
                users.push(user);
            }
        });
    
        if(users.length != 0){
          console.log(users)
          axios.post(urlBase() + "users/adicionar/bulk", {users: JSON.stringify(users)})
          .then((response) => {
            if(isDebugging()) console.log("Adicionado")
            reloadTable()
            insertLogs('user', 'bulk', users.length.toString())
          })
          .catch((error) => {
            if(isDebugging()) console.log(error)
          }); 
        }

        if(log.length != 0){
          setLogs(log)
        }
        setCount(users.length)
        setShow(true)
      }

    })

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

  const handleDrop = (e) => {
    setFile(e.target.files[0])
    sendFile(e.target.files[0])
    closeModal()
    e.preventDefault()
  }

  const callHide = () => {
    setShow(false)
  }

  return (
    <>
      <div className="pt-3 inset-0 flex items-center justify-end">
        {
          isLoading
          ?
          <button type="button" disabled><BotaoAddBulk /></button>
          :
          <button type="button" onClick={openModal}><BotaoAddBulk /></button>
        }
      </div>
      <PopUp show={show} callHide={callHide} logs={logs} count={count} />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                    className="pb-3 text-center text-2xl font-bold leading-6 text-gray-900"
                  >
                    Adicionar Utilizadores
                  </Dialog.Title>
                    <div className="mt-5">
                      <div className="max-w-xl">
                            <label
                                className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                <span className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="font-medium text-gray-600">
                                        Escolha um ficheiro (.xlsx)
                                    </span>
                                </span>
                                <input type="file" name="file_upload" className="hidden" onChange={(e)=>handleDrop(e)} />
                            </label>
                        </div>
                        <a href={urlBase() + "uploads/file/bulk"} download className='flex justify-center pt-4 transition-all text-blue-500'>Descarregar Template</a>
                    </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )

}

export default AddMultiple
