import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import { isDebugging, urlBase } from '../../utils/Utils'
import '../tables/styles.css'
import Swal from 'sweetalert2'
import authHeader from '../auth/auth-header';
import { Button, Upload } from 'antd';
import { MdOutlineFileUpload } from 'react-icons/md'

export function EditUser({
  show,
  callHide,
  loadInfo,
  reloadImage
}) {

  let [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [apelido, setApelido] = useState("")
  const [cargo, setCargo] = useState("")
  const [telemovel, setTelemovel] = useState("")
  const [email, setEmail] = useState("")
  const [imagem, setImagem] = useState("")

  let status = show

  const getUser = () => {

    const user = JSON.parse(localStorage.getItem('auth'));
    if (user) {
        const config = {
          headers: authHeader()
        };
        axios.get(urlBase() + "users/perfil/info", config)
          .then(res => {
              const dados = res.data.infos

              if(dados != null){
                const myArray = dados.utilizador.split(" ");
                setNome(myArray[0])
                setApelido(myArray[1])
                setCargo(dados.cargo)
                setTelemovel(dados.telemovel)
                setEmail(dados.email)
              }

          }).catch(error => { 
            if(isDebugging()) console.log(error)
          })
    }
  }

  const props = {
    maxCount: 1,
    onRemove: (file) => {
      setImagem("")
    },
    beforeUpload: (file) => {
      setImagem(file);
      console.log(imagem)
      return false;
    },
    imagem,
  };

  useEffect(() => {
    getUser()
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
                    Alterar Perfil
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
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Endereço e-mail *</label>
                            <input value={email} onChange={value=>setEmail(value.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nome@sofinsa.pt" required />
                        </div>
                        <div id='Upload' className="mb-6">
                            <Upload {...props} >
                              <Button icon={<MdOutlineFileUpload className='inline mr-3' />}>Carregar Imagem</Button>
                            </Upload>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-xs font-medium text-gray-900 dark:text-black-300">* Campos obrigatórios</label>
                        </div>
                        <button type="submit" onClick={(e)=>editUser(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Alterar</button> {/* onClick={closeModal} */}
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

    if(imagem != ""){

      const formData = new FormData()
      formData.append('file', imagem)
      const config = {
        headers: authHeader()
      };
      axios.get(urlBase() + "users/nuser", config)
        .then(res => {

          if(res.data.success){
            axios.post(urlBase() + "uploads/upload/" + res.data.nutilizador, formData)
            .then(res => {
              setImagem(res.data)
              const user = JSON.parse(localStorage.getItem('auth'));
              if (user) {
                const dataJson = {
                  accessToken: user.accessToken,
                  cargo: cargo,
                  imagem: res.data,
                  nome: nome + " " + apelido,
                }
                localStorage.setItem("auth", JSON.stringify(dataJson));
                reloadImage(res.data)
                loadInfo()
              }
            }).catch(error => {
              if(isDebugging()) console.log(error)
            })
          }else{
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Atenção!',
              text: 'Não foi possível atualizar a sua imagem!',
              showConfirmButton: false,
              timer: 2000,
              customClass: { popup: "swal2-border-radius" }
            })
          }

        }).catch(error => {
          if(isDebugging()) console.log(error)
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Atenção!',
            text: 'Não foi possível atualizar a sua imagem!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
        })
    }
    
    const datapost = {
      nome: nome + " " + apelido,
      cargo: cargo,
      telemovel: telemovel,
      email: email,
    }

    const config = {
      headers: authHeader()
    };

    axios.put(urlBase() + "users/gestor/atualizar", datapost, config)
      .then(res => {
          const user = JSON.parse(localStorage.getItem('auth'));
          if (user) {
            const dataJson = {
              accessToken: user.accessToken,
              cargo: cargo,
              imagem: user.imagem,
              nome: nome + " " + apelido,
            }
            localStorage.setItem("auth", JSON.stringify(dataJson));
          }
          closeModal()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'Utilizador atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          loadInfo()
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

export default EditUser
