import React, { useEffect, useState } from 'react'
import { Table, Switch, Popconfirm } from 'antd'
import 'antd/dist/antd.css'
import './styles.css'
import { AddNewUserModal } from './addNewUser'
import { AddMultiple } from './addMultipleUsers'
import { EditUserModal } from './editUsers'
import { MdDelete } from 'react-icons/md'
import { MdModeEditOutline } from 'react-icons/md'
import { MdWarning } from 'react-icons/md'
import { MdModeEdit } from 'react-icons/md'
import axios from 'axios'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import locale from '../tables/translate'
import Swal from 'sweetalert2'
import { itemRender } from '../tables/pagination'
import isAdmin from '../hooks/isAdmin'

function MyCSearchTable() {

  const [show, setShow] = useState(false)
  const [chave, setChave] = useState("0")
  const [dataSource, setDataSource] = useState([{}])
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState(dataSource);
  const nestabelecimento = defineLocal()
  const [loading, setLoading] = useState(true);
  const [waitAxios, setWaitAxios] = useState(true)

  const [role, setRole] = useState(isAdmin())

  var isChecked = localStorage.getItem("checked")
  if(isChecked){
    isChecked = true
    var url = "algoritmos/list/estabelecimentos/nulos/"
  }else{
    isChecked = false
    var url = "algoritmos/list/estabelecimentos/associados/"
  }
    
  var i = 0;

  const handleEdit = (key) => {
    setShow(true)
    setChave(key)
  };

  const handleDesativar = (key) => {
    Swal.fire({
      title: 'Atenção!',
      text: "Ao desativar o utilizador, todas as suas reservas serão removidas!",
      icon: 'warning',
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
        axios.put(urlBase() + "users/estado/" + key)
          .then(res =>  {
              Swal.fire({
                title: 'Sucesso!',
                text: 'O estado do utilizador foi alterado com sucesso!',
                icon: 'success',
                confirmButtonClass: "swal2-border-radius",
                confirmButtonColor: '#2d63ed',
                customClass: { popup: "swal2-border-radius",  },
              })
              loadTable()
              const user = dataSource.find((item) => item.key === key)
              insertLogs('user', 'status_delete', user.user)
          }).catch(error => {
            Swal.fire({
              title: 'Alerta!',
              text: 'Não foi possível alterar o estado do utilizador!',
              icon: 'error',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
          })
      }
    })
  }

  const handleAtivar = (key) => {
    Swal.fire({
      title: 'Atenção!',
      text: "Tem a certeza que pretende reativar o utilizador?",
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
        axios.put(urlBase() + "users/estado/" + key)
          .then(res =>  {
              Swal.fire({
                title: 'Sucesso!',
                text: 'O estado do utilizador foi alterado com sucesso.',
                icon: 'success',
                confirmButtonClass: "swal2-border-radius",
                confirmButtonColor: '#2d63ed',
                customClass: { popup: "swal2-border-radius",  },
              })
              loadTable()
              const user = dataSource.find((item) => item.key === key)
              insertLogs('user', 'status_active', user.user)
          }).catch(error => {
            Swal.fire({
              title: 'Alerta!',
              text: 'Não foi possível alterar o estado do utilizador!',
              icon: 'error',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
          })
      }
    })
  }

  useEffect(() => {
    loadTable()
  }, [])

  const loadTable = () => {
    setLoading(true)
    axios.get(urlBase() + url + nestabelecimento)
      .then(res => {
        const tempSource = []
        const data = res.data.data
        if(data.length != 0){
          data.map(x => {
            const cargo = []
            const estado = []
            cargo.push({grau: x.grau, cargo: x.tipo})
            estado.push(x.estado)
            tempSource.push({key: x.nutilizador, user: x.utilizador, telemovel: x.telemovel, cargo: cargo, email: x.email, estado: estado, grau: x.grau})
          })
        }
        setDataSource(tempSource)
        setFilteredResults(tempSource)
        setLoading(false)
        setWaitAxios(false)
      }).catch(error => {
        setDataSource([{}])
        setFilteredResults([])
        setLoading(false)
        if(isDebugging()) console.log(error)
      })
  }

  const typeEstado = (x, key, grau) => {

    if(grau == 1 && role == 0){
      if (x === 1) {
        return (
          <button type="button" disabled className="opacity-25 text-white bg-green-400 hover:bg-green-500/90 font-sm rounded-full text-sm px-5 text-center inline-flex items-center py-1 mr-2 mb-2">
            <MdModeEdit className="w-4 h-4 mr-2 -ml-1" />
            Ativo
          </button>
        )
      }else if (x === 0) {
        return (
          <button type="button" disabled className="opacity-25 text-white bg-red-400 hover:bg-red-500/90 font-sm rounded-full text-sm px-5 text-center inline-flex items-center py-1 mr-2 mb-2">
          <MdModeEdit className="w-4 h-4 mr-2 -ml-1" />
          Inativo
        </button>
        )
      }else{
        return (<span></span>)
      }
    }else{
      if (x === 1) {
        return (
          <button type="button" onClick={()=>handleDesativar(key)} className="text-white bg-green-400 hover:bg-green-500/90 font-sm rounded-full text-sm px-5 text-center inline-flex items-center py-1 mr-2 mb-2">
            <MdModeEdit className="w-4 h-4 mr-2 -ml-1" />
            Ativo
          </button>
        )
      }else if (x === 0) {
        return (
          <button type="button" onClick={()=>handleAtivar(key)} className="text-white bg-red-400 hover:bg-red-500/90 font-sm rounded-full text-sm px-5 text-center inline-flex items-center py-1 mr-2 mb-2">
          <MdModeEdit className="w-4 h-4 mr-2 -ml-1" />
          Inativo
        </button>
        )
      }else{
        return (<span></span>)
      }
    }

  }

  const botoesAcoes = (grau, key) => {
    if(grau == 1 && role == 0){
      return(
        <div className='flex gap-2'>
          <button disabled class="opacity-25 transition-all rounded-full px-5 py-2.5 font-medium bg-yellow-50 hover:bg-yellow-500 hover:text-yellow-50 text-yellow-500 rounded-lg text-sm">
            <MdModeEditOutline />
          </button>
          <button disabled class="opacity-25 transition-all rounded-full px-5 py-2.5 font-medium bg-red-50 hover:bg-red-500 hover:text-red-50 text-red-500 rounded-lg text-sm">
            <MdDelete />
          </button>
        </div>
      )
    }else{
      return(
        <div className='flex gap-2'>
          <button onClick={()=>handleEdit(key)} class="transition-all rounded-full px-5 py-2.5 font-medium bg-yellow-50 hover:bg-yellow-500 hover:text-yellow-50 text-yellow-500 rounded-lg text-sm">
            <MdModeEditOutline />
          </button>
          <button onClick={()=>handleDelete(key)} class="transition-all rounded-full px-5 py-2.5 font-medium bg-red-50 hover:bg-red-500 hover:text-red-50 text-red-500 rounded-lg text-sm">
            <MdDelete />
          </button>
        </div>
      )
    }
  }

  const columns = [
    {
      title: 'Nome do Utilizador',
      dataIndex: 'user',
      onFilter: (value, record) => record.user.indexOf(value) === 0,
      sorter: (a, b) => (a.user > b.user) - (a.user < b.user),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Telemóvel',
      dataIndex: 'telemovel',
    },
    {
      title: 'Tipo',
      key: 'cargo',
      dataIndex: 'cargo',
      filters: [
        {
          text: 'Funcionário',
          value: 'Funcionário',
        },
        {
          text: 'Gestor de Espaços',
          value: 'Gestor de Espaços',
        },
        {
          text: 'Requisitante',
          value: 'Requisitante',
        },
      ],
      render: (_, { cargo }) => (
        <>
          {dataSource.length != 0 ? (
          cargo.map((tag) => {
            if (tag.cargo === 'Gestor de Espaços') {
              if(tag.grau === 1){
                return (
                  <>
                    <span className="text-sm bg-indigo-400 text-white rounded-full py-1 mr-2 mb-2 px-4 whitespace-nowrap">{tag.cargo}</span>
                    <br />
                    <br />
                    <span className="text-sm bg-red-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Administrador</span>
                  </>
                )
              }else return (<span className="text-sm bg-indigo-400 text-white rounded-full py-1 mr-2 mb-2 px-4 whitespace-nowrap">{tag.cargo}</span>)
            }else if (tag.cargo === 'Requisitante') {
              return (<span className="text-sm bg-blue-400 text-white rounded-full py-1 mr-2 mb-2 px-4">{tag.cargo}</span>)
            }else if(tag.cargo === "Funcionário"){
              return (<span className="text-sm bg-purple-400 text-white rounded-full py-1 mr-2 mb-2 px-4">{tag.cargo}</span>)
            }else{
              return (<span></span>)
            }
          })) : <span className="text-sm bg-gray-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Indefinido</span>}
        </>
      ),
      onFilter: (value, record) => (
        record.cargo[0].cargo.indexOf(value) === 0
      ),
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
    },
    {
      title: 'Estado',
      key: 'estado',
      render: (_, record) =>
      dataSource.length >= 1 ? (
        typeEstado(parseInt(record.estado), record.key, record.grau)
      ) : null,
    },
    {
      title: 'Ação',
      key: 'action',
      render: (_, record) =>
      dataSource.length >= 1 ? (
        botoesAcoes(record.grau, record.key)
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

  const onSwitch = (checked) => {
    if(checked === true){
      url = "algoritmos/list/estabelecimentos/nulos/" 
      localStorage.setItem("checked", true)
    }
    else{
      url = "algoritmos/list/estabelecimentos/associados/"
      localStorage.removeItem("checked")
    } 
    loadTable()
  };

  const handleDelete = (key) => {

    Swal.fire({
      title: 'Atenção',
      text: "Tem a certeza que pretende apagar o utilizador?",
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
        axios.delete(urlBase() + "users/remover/" + key)
          .then(res => {
            Swal.fire({
              title: 'Sucesso!',
              text: 'O utilizador foi apagado com sucesso!',
              icon: 'success',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
            setDataSource(newData)
            setFilteredResults(newData)
            setLoading(false)
            const user = dataSource.find((item) => item.key === key)
            insertLogs('user', 'delete', user.user)
          }).catch(error => {
            if(isDebugging()) console.log(error)
            setLoading(false)
            Swal.fire({
              title: 'Atenção!',
              text: 'Não foi possível apagar o utilizador!',
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
        <AddNewUserModal reloadTable={loadTable} />
        <AddMultiple reloadTable={loadTable} />
      </div>
      <div id='Pag'>
        <EditUserModal show={show} key={chave} id={chave} reloadTable={loadTable} callHide={callHide} />
        <div className='mb-2 mt-2 pb-3 flex justify-start gap-3'>
          {
            role 
            ? <>
                <Switch defaultChecked={isChecked} onChange={onSwitch} />
                <label>Incluir utilizadores sem estabelecimentos associados</label>
              </>
            : <></>
          }
        </div>
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
