import React, { useEffect, useState } from 'react'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Switch } from 'antd'
import Loading from '../actions/Loading'

const Single = () => {

    const [estabelecimento, setEstabelecimento] = useState("")
    const [localidade, setLocalidade] = useState("")
    const [isChecked, setIsChecked] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const id = defineLocal()

    useEffect(() => {
        getEstabelecimento()
    }, [])
    
    const getEstabelecimento = () => {
        axios.get(urlBase() + "estabelecimentos/get/" + id)
          .then(res => {
              const dados = res.data.data
    
              if(dados != null){
                setEstabelecimento(dados.estabelecimento)
                setLocalidade(dados.localidade)
                if(dados.estado === 1) setIsChecked(true)
              }
              setIsLoading(false)
          }).catch(error => { 
            if(isDebugging()) console.log(error)
            setIsLoading(false)
          })
    }

    const onSwitch = (checked) => {

        if(!checked){
            Swal.fire({
              title: 'Atenção!',
              text: 'Pretende remover todas as reservas associadas a este estabelecimento?',
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: 'Sim',
              denyButtonText: 'Não',
              icon: 'question',
              confirmButtonClass: "swal2-border-radius",
              denyButtonClass: "swal2-border-radius",
              cancelButtonClass: "swal2-border-radius",
              cancelButtonText: "Cancelar",
              confirmButtonColor: '#2d63ed',
              denyButtonColor: '#d33',
              customClass: { popup: "swal2-border-radius",  },
            }).then((result) => {
              if (result.isConfirmed) {
                
                axios.put(urlBase() + "estabelecimentos/atualizar/estado/" + id, {option: 'delete'})
                .then(res =>  {
                  if(res.data.success){
                    Swal.fire({
                      title: 'Sucesso!',
                      text: 'O estado do estabelecimento foi alterado com sucesso!',
                      icon: 'success',
                      confirmButtonClass: "swal2-border-radius",
                      confirmButtonColor: '#2d63ed',
                      customClass: { popup: "swal2-border-radius",  },
                    })
                    setIsChecked(checked)
                    insertLogs('estabelecimento', 'status_delete', estabelecimento)
                  }else{
                    Swal.fire({
                      title: 'Alerta!',
                      text: 'Não foi possível alterar o estado do estabelecimento!',
                      icon: 'error',
                      confirmButtonClass: "swal2-border-radius",
                      confirmButtonColor: '#2d63ed',
                      customClass: { popup: "swal2-border-radius",  },
                    })
                  }
                }).catch(error => {
                  Swal.fire({
                    title: 'Alerta!',
                    text: 'Não foi possível alterar o estado do estabelecimento!',
                    icon: 'error',
                    confirmButtonClass: "swal2-border-radius",
                    confirmButtonColor: '#2d63ed',
                    customClass: { popup: "swal2-border-radius",  },
                  })
                })
      
              } else if (result.isDenied) {
                
                axios.put(urlBase() + "estabelecimentos/atualizar/estado/" + id)
                .then(res =>  {
                  if(res.data.success){
                    Swal.fire({
                      title: 'Sucesso!',
                      text: 'O estado do estabelecimento foi alterado com sucesso!',
                      icon: 'success',
                      confirmButtonClass: "swal2-border-radius",
                      confirmButtonColor: '#2d63ed',
                      customClass: { popup: "swal2-border-radius",  },
                    })
                    setIsChecked(checked)
                    insertLogs('estabelecimento', 'status_keep', estabelecimento)
                  }else{
                    Swal.fire({
                      title: 'Alerta!',
                      text: 'Não foi possível alterar o estado do estabelecimento!',
                      icon: 'error',
                      confirmButtonClass: "swal2-border-radius",
                      confirmButtonColor: '#2d63ed',
                      customClass: { popup: "swal2-border-radius",  },
                    })
                  }
                }).catch(error => {
                  Swal.fire({
                    title: 'Alerta!',
                    text: 'Não foi possível alterar o estado do estabelecimento!',
                    icon: 'error',
                    confirmButtonClass: "swal2-border-radius",
                    confirmButtonColor: '#2d63ed',
                    customClass: { popup: "swal2-border-radius",  },
                  })
                })
      
              }else{
                window.location.reload()
              }
            })
      
          }else{
            Swal.fire({
              title: 'Atenção',
              text: "Tem a certeza que pretende reativar o estabelecimento?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonClass: "swal2-border-radius",
              cancelButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              cancelButtonColor: '#d33',
              customClass: { popup: "swal2-border-radius",  },
              confirmButtonText: 'Continuar',
              cancelButtonText: "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) {
                axios.put(urlBase() + "estabelecimentos/atualizar/estado/" + id)
                  .then(res =>  {
                    if(res.data.success){
                      Swal.fire({
                        title: 'Sucesso!',
                        text: 'O estado do estabelecimento foi alterado com sucesso!',
                        icon: 'success',
                        confirmButtonClass: "swal2-border-radius",
                        confirmButtonColor: '#2d63ed',
                        customClass: { popup: "swal2-border-radius",  },
                      })
                      setIsChecked(checked)
                      insertLogs('estabelecimento', 'status_active', estabelecimento)
                    }else{
                      Swal.fire({
                        title: 'Alerta!',
                        text: 'Não foi possível alterar o estado do estabelecimento!',
                        icon: 'error',
                        confirmButtonClass: "swal2-border-radius",
                        confirmButtonColor: '#2d63ed',
                        customClass: { popup: "swal2-border-radius",  },
                      })
                    }
                  }).catch(error => {
                    Swal.fire({
                      title: 'Alerta!',
                      text: 'Não foi possível alterar o estado do estabelecimento!',
                      icon: 'error',
                      confirmButtonClass: "swal2-border-radius",
                      confirmButtonColor: '#2d63ed',
                      customClass: { popup: "swal2-border-radius",  },
                    })
                  })
              }else{
                window.location.reload()
              }
            })
        }

        setIsChecked(!checked)
    };

    return (
        <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
            <div className="p-5">
                {
                    isLoading ? <Loading />
                    :
                    <form>
                        <div className="mb-6 flex justify-center">                  
                            <Switch defaultChecked={isChecked} onChange={onSwitch} />
                            <label htmlFor="ativo" className="ml-2 text-sm font-medium text-gray-900">{isChecked ? 'Ativado':'Desativado'}</label>
                        </div>
                        <div className="grid gap-6 mb-6 xs:grid-cols-2">
                            <div>
                            <label htmlFor="estabelecimento" className="block mb-2 text-sm font-medium text-gray-900">Estabelecimento *</label>
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
                        <button onClick={(e)=>editEstabelecimento(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Alterar</button>
                    </form>
                }
            </div>
        </div>
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
          }).catch(error => {
            if(isDebugging()) console.log(error)
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

export default Single