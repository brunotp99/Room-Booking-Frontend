import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import { insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import '../tables/styles.css'
import Swal from 'sweetalert2'
import RangeAlocacao from './alocacao'
import RangeIntervalo from './intervalo'
import { Button, message, Upload } from 'antd';
import { MdOutlineFileUpload } from 'react-icons/md'
import './salas.css'

export function EditSala({
  show,
  id,
  reloadTable,
  callHide
}) {

  let [isOpen, setIsOpen] = useState(false)
  const [sala, setSala] = useState("")
  const [lugares, setLugares] = useState(0)
  const [descricao, setDescricao] = useState("")
  const [alocacao, setAlocacao] = useState(100)
  const [intervalo, setIntervalo] = useState(15)
  const [imagem, setImagem] = useState("");

  let status = show

  const getSala = () => {
    axios.get(urlBase() + "salas/get/" + id)
      .then(res => {
          const dados = res.data.data
          
          if(dados != null){
            setSala(dados.sala)
            setLugares(parseInt(dados.lugares))
            setDescricao(dados.descricao)
            setAlocacao(parseInt(dados.alocacao))
            setIntervalo(parseInt(dados.intervalolimpeza))
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
                    Alterar Sala
                  </Dialog.Title>
                    <div className="mt-2">
                      <form>
                          <div className="grid gap-6 mb-6 xs:grid-cols-2">
                              <div>
                                <label htmlFor="sala" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Sala *</label>
                                <input value={sala} onChange={value=>setSala(value.target.value)} type="text" id="sala" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Sala Universo" required />
                              </div>
                              <div>
                                <label htmlFor="lugares" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Lugares *</label>
                                <input value={lugares} onChange={value=>setLugares(value.target.value)} type="number" id="lugares" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="15" required />
                              </div>
                          </div>
                          <div id='Upload' className="mb-6">
                            <Upload {...props} >
                              <Button icon={<MdOutlineFileUpload className='inline mr-3' />}>Carregar Imagem</Button>
                            </Upload>
                          </div>
                          <div className="mb-6">
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Descrição</label>
                            <textarea id="descricao" rows="4" maxLength={200} value={descricao} onChange={value=>setDescricao(value.target.value)} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Descrição da sala..."></textarea>
                          </div>
                          <div className="mb-6">
                            <label htmlFor="alocacao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Alocação</label>
                            <RangeAlocacao setAlocacao={setAlocacao} alocacao={alocacao} />
                          </div>
                          <div className="mb-6">
                            <label htmlFor="intervalo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Intervalo de Limpeza</label>
                            <RangeIntervalo setIntervalo={setIntervalo} intervalo={intervalo} />
                          </div>
                          <hr className='my-3'/>
                          <div className="mb-6">
                            <label htmlFor="text" className="block mb-2 text-xs font-medium text-gray-900 dark:text-black-300">* Campos obrigatórios</label>
                        </div>
                          <button onClick={(e)=>edtiSala(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Editar</button> {/* onClick={closeModal} */}
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

  function edtiSala(e){

    if(sala == "" || lugares == 0){
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
      const formData = new FormData();
      formData.append('file', imagem)
      fetch(urlBase() + "uploads/sala/upload/" + id, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(() => {
          setImagem("");
        })
        .catch(() => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Atenção!',
            text: 'Não foi possível atualizar a imagem!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
        })
        .finally(() => {
          
        });
    }

    const datapost = {
      sala: sala,
      lugares: lugares,
      descricao: descricao,
      alocacao: alocacao,
      intervalolimpeza: intervalo
    }

    axios.put(urlBase() + "salas/atualizar/sala/" + id, datapost)
      .then(res => {
          closeModal()
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sucesso!',
            text: 'A sala foi atualizada com sucesso!',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: "swal2-border-radius" }
          })
          reloadTable()
          insertLogs('sala', 'edit', sala)
      }).catch(error => {
        if(isDebugging()) console.log(error)
        closeModal()
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Atenção!',
          text: 'Não foi possível atualizar a sala!',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      })
    e.preventDefault()
  }
}

export default EditSala
