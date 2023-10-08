import React, { useEffect, useState } from 'react'
import { Table, Popconfirm } from 'antd'
import 'antd/dist/antd.css'
import '../tables/styles.css'
import { AddEstabelecimento } from './addEstabelecimento'
import { EditEstabelecimento } from './editEstabelecimento'
import { MdDelete } from 'react-icons/md'
import { MdModeEditOutline } from 'react-icons/md'
import { MdWarning } from 'react-icons/md'
import { MdModeEdit } from 'react-icons/md'
import axios from 'axios'
import { insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import locale from '../tables/translate'
import Swal from 'sweetalert2'
import { itemRender } from '../tables/pagination'

function MyCSearchTable() {

  const [show, setShow] = useState(false)
  const [chave, setChave] = useState("0")
  const [dataSource, setDataSource] = useState([{}])
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState(dataSource);
  const [loading, setLoading] = useState(true);
  const [waitAxios, setWaitAxios] = useState(true)

  const handleEdit = (key) => {
    setShow(true)
    setChave(key)
  };

  const handleState = (key, estado) => {

    if(estado == 1){

      Swal.fire({
        title: 'Atenção!',
        text: 'Pretende remover todas as reservas associadas a este estabelecimento?',
        showDenyButton: true,
        confirmButtonText: 'Sim',
        denyButtonText: 'Não',
        icon: 'question',
        confirmButtonClass: "swal2-border-radius",
        denyButtonClass: "swal2-border-radius",
        confirmButtonColor: '#2d63ed',
        denyButtonColor: '#d33',
        customClass: { popup: "swal2-border-radius",  },
      }).then((result) => {
        if (result.isConfirmed) {
          
          axios.put(urlBase() + "estabelecimentos/atualizar/estado/" + key, {option: 'delete'})
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
              loadTable()
              const estabelecimento = dataSource.find((item) => item.key === key)
              insertLogs('estabelecimento', 'status_delete', estabelecimento.estabelecimento)
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
          
          axios.put(urlBase() + "estabelecimentos/atualizar/estado/" + key)
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
              loadTable()
              const estabelecimento = dataSource.find((item) => item.key === key)
              insertLogs('estabelecimento', 'status_keep', estabelecimento.estabelecimento)
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
          axios.put(urlBase() + "estabelecimentos/atualizar/estado/" + key)
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
                loadTable()
                const estabelecimento = dataSource.find((item) => item.key === key)
                insertLogs('estabelecimento', 'status_active', estabelecimento.estabelecimento)
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
        }
      })
    }

  }

  useEffect(() => {
    loadTable()
  }, [])

  const loadTable = () => {
    setLoading(true)
    axios.get(urlBase() + "estabelecimentos")
      .then(res => {
        const tempSource = []
        const data = res.data.data
        data.map(x => {
          const estado = []
          estado.push(x.estado)
          tempSource.push({key: x.nestabelecimento, estado: estado, estabelecimento: x.estabelecimento, localidade: x.localidade})
        })
        setDataSource(tempSource)
        setFilteredResults(tempSource)
        setLoading(false)
        setWaitAxios(false)
      }).catch(error => {
        setDataSource([{}])
        setFilteredResults([{}])
        setLoading(false)
        if(isDebugging()) console.log(error)
      })
  }

  const typeEstado = (x, key) => {
    if (x === 1) {
      return (
        <button type="button" onClick={()=>handleState(key, x)} className="text-white bg-green-400 hover:bg-green-500/90 font-sm rounded-full text-sm px-5 text-center inline-flex items-center py-1 mr-2 mb-2">
          <MdModeEdit className="w-4 h-4 mr-2 -ml-1" />
          Ativo
        </button>
      )
    }else if (x === 0) {
      return (
        <button type="button" onClick={()=>handleState(key, x)} className="text-white bg-red-400 hover:bg-red-500/90 font-sm rounded-full text-sm px-5 text-center inline-flex items-center py-1 mr-2 mb-2">
        <MdModeEdit className="w-4 h-4 mr-2 -ml-1" />
        Inativo
      </button>
      )
    }else{
      return (<span></span>)
    }
  }

  const columns = [
    {
      title: 'Estabelecimento',
      dataIndex: 'estabelecimento',
      onFilter: (value, record) => record.estabelecimento.indexOf(value) === 0,
      sorter: (a, b) => (a.estabelecimento > b.estabelecimento) - (a.estabelecimento < b.estabelecimento),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Localidade',
      dataIndex: 'localidade',
      sorter: (a, b) => (a.localidade > b.localidade) - (a.localidade < b.localidade),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Estado',
      key: 'estado',
      dataIndex: 'estado',
      render: (_, record) =>
      dataSource.length >= 1 ? (
        typeEstado(parseInt(record.estado), record.key)
      ) : null,
      sorter: (a, b) => (a.estado > b.estado) - (a.tags < b.estado),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Ação',
      key: 'action',
      render: (_, record) =>
      dataSource.length >= 1 ? (
        <div className='flex gap-2'>
          <button onClick={()=>handleEdit(record.key)} class="transition-all rounded-full px-5 py-2.5 font-medium bg-yellow-50 hover:bg-yellow-500 hover:text-yellow-50 text-yellow-500 rounded-lg text-sm">
            <MdModeEditOutline />
          </button>
          <button onClick={()=>handleDelete(record.key)} class="transition-all rounded-full px-5 py-2.5 font-medium bg-red-50 hover:bg-red-500 hover:text-red-50 text-red-500 rounded-lg text-sm">
            <MdDelete />
          </button>
        </div>
      ) : null,
    },
  ]

  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchInput !== '' || searchInput.length !== 0) {
      const filterTable = dataSource.filter(
        (data) => JSON.stringify(data).toLowerCase().indexOf(searchValue.toLowerCase()) !== -1,
      )
      setFilteredResults(filterTable)
    }
    else setFilteredResults(dataSource)    
  }

  const callHide = () => {
    setShow(false)
  }

  const tableProps = {
    loading,
  };

  const handleDelete = (key) => {
    
    Swal.fire({
      title: 'Atenção',
      text: "Tem a certeza que pretende apagar o pedido?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonClass: "swal2-border-radius",
      cancelButtonClass: "swal2-border-radius",
      confirmButtonColor: '#d33',
  
      customClass: { popup: "swal2-border-radius",  },
      confirmButtonText: 'Remover',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        /* Solicitação Axios */
        setLoading(true)
        const newData = dataSource.filter((item) => item.key !== key);
        axios.delete(urlBase() + "estabelecimentos/remover/" + key)
          .then(res => {
            Swal.fire({
              title: 'Sucesso!',
              text: 'O pedido foi apagado com sucesso!',
              icon: 'success',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
            setDataSource(newData)
            setFilteredResults(newData)
            setLoading(false)
            const estabelecimento = dataSource.find((item) => item.key === key)
            insertLogs('estabelecimento', 'delete', estabelecimento.estabelecimento)
            window.location.reload(false)
          }).catch(error => {
            if(isDebugging()) console.log(error)
            setLoading(false)
            Swal.fire({
              title: 'Atenção!',
              text: 'Não foi possível apagar o pedido!',
              icon: 'error',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
          })
          /* Fim Solicitação Axios */
      }
    })
  
  };

  if(waitAxios){
    return(
      <Table
        {...tableProps}
        locale={locale}
        columns={columns}
        pagination={{
          itemRender: itemRender,
          pageSize: 6,
        }}
        scroll={{ x: 1000 }}
      />
    )
  }

  return (
    <>
      <div className="linhaSearch">
        <input
          className="nosubmit"
          type="search"
          value={searchInput}
          placeholder='Pesquisar...'
          onChange={(e) => searchItems(e.target.value)}
        ></input>
      </div>
      <div className='pb-3 flex justify-end gap-3'>
        <AddEstabelecimento reloadTable={loadTable} />
      </div>
      <div id='Pag'>
        <EditEstabelecimento show={show} key={chave} id={chave} reloadTable={loadTable} callHide={callHide} />
        <Table
          {...tableProps}
          locale={locale}
          columns={columns}
          dataSource={filteredResults}
          pagination={{
            itemRender: itemRender,
            pageSize: 6,
          }}
          scroll={{ x: 1000 }}
        />
      </div>
    </>
  )
}

export default MyCSearchTable
