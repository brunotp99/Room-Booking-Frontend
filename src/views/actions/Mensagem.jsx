import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import { Input } from 'antd';
const { TextArea } = Input;
import './css/mensagem.css'

export function Mensagem(props) {

  const [descricao, setDescricao] = useState("")

  String.prototype.maxLength = function (length) {
    return this.length > length ? this.substring(0, length) : this;
  }

  const notificacao = () => {
    axios.post(urlBase() + "reservas/notificar/" + props.id, {tipo: props.type, title: props.title, message: descricao.maxLength(400)})
    .then(res =>  {
        if(isDebugging()) console.log(res.data)
    }).catch(error => {
        if(isDebugging()) console.log(error)
    })
  }

  const enviarNotificacao = () => {
    props.close()
    if (props.isConfirmed) {

        axios.put(urlBase() + "salas/atualizar/estado/" + props.id, {option: 'delete', message: descricao.maxLength(400)})
        .then(res =>  {
          if(res.data.success){
            Swal.fire({
              title: 'Sucesso!',
              text: 'O estado da sala foi alterado com sucesso!',
              icon: 'success',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
            props.loadTable()
            const sala = props.dataSource.find((item) => item.key === props.id)
            insertLogs('sala', 'status_delete', sala.sala)
            notificacao()
          }else{
            Swal.fire({
              title: 'Alerta!',
              text: 'Não foi possível alterar o estado da sala!',
              icon: 'error',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
          }
        }).catch(error => {
          Swal.fire({
            title: 'Alerta!',
            text: 'Não foi possível alterar o estado da sala!',
            icon: 'error',
            confirmButtonClass: "swal2-border-radius",
            confirmButtonColor: '#2d63ed',
            customClass: { popup: "swal2-border-radius",  },
          })
        })

      }else {
        
        axios.put(urlBase() + "salas/atualizar/estado/" + props.id, {message: descricao.maxLength(400)})
        .then(res =>  {
          if(res.data.success){
            Swal.fire({
              title: 'Sucesso!',
              text: 'O estado da sala foi alterado com sucesso!',
              icon: 'success',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
            props.loadTable()
            const sala = props.dataSource.find((item) => item.key === props.id)
            insertLogs('sala', 'status_keep', sala.sala)
            notificacao()
          }else{
            Swal.fire({
              title: 'Alerta!',
              text: 'Não foi possível alterar o estado da sala!',
              icon: 'error',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
          }
        }).catch(error => {
          Swal.fire({
            title: 'Alerta!',
            text: 'Não foi possível alterar o estado da sala!',
            icon: 'error',
            confirmButtonClass: "swal2-border-radius",
            confirmButtonColor: '#2d63ed',
            customClass: { popup: "swal2-border-radius",  },
          })
        })

      }
  }

  return (
    <>
      <Transition appear show={props.show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={props.close}>
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
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Notificação
                  </Dialog.Title>
                  <div id='Mensagem' className="mb-6">
                    <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black-300">Por favor, indique a motivação:</label>
                    <TextArea showCount rows={4} maxLength={400} onChange={value=>setDescricao(value.target.value)} placeholder={"Descrição da motivação..."} />
                  </div>
                  <div className="mt-4">
                    <button onClick={(e)=>enviarNotificacao(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Enviar</button>
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

export default Mensagem