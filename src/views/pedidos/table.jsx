import React, { useEffect, useState } from 'react'
import { Table, Popconfirm } from 'antd'
import 'antd/dist/antd.css'
import '../tables/styles.css'
import { AddPedido } from './addPedido'
import { EditPedido } from './editPedido'
import { MdDelete } from 'react-icons/md'
import { MdModeEditOutline } from 'react-icons/md'
import { MdWarning } from 'react-icons/md'
import { MdModeEdit } from 'react-icons/md'
import { BsTrashFill } from 'react-icons/bs'
import axios from 'axios'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import locale from '../tables/translate'
import Swal from 'sweetalert2'
import moment from 'moment'
import { itemRender } from '../tables/pagination'

function MyCSearchTable() {

  const [show, setShow] = useState(false)
  const [chave, setChave] = useState("0")
  const [dataSource, setDataSource] = useState([{}])
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState(dataSource);
  const [loading, setLoading] = useState(true);
  const [waitAxios, setWaitAxios] = useState(true)

  const nestabelecimento = defineLocal()

  const handleEdit = (key) => {
    setShow(true)
    setChave(key)
  };

  useEffect(() => {
    loadTable()
  }, [])

  const loadTable = () => {
    setLoading(true)
    axios.get(urlBase() + "pedidos/list/" + nestabelecimento)
      .then(res => {
        const temp = []
        const data = res.data.data
        data.map(x => {
          const estado = []
          const tipo = []
          tipo.push(x.tipo)
          estado.push(x.terminado.toString())
          var nuser = 0
          var user = "-"
          if(x.nutilizador !== null){
            nuser = x.nutilizador
            user = x.utilizador.utilizador
          }
          temp.push({key: x.npedido, nsala: x.nsala, sala: x.sala.sala, nutilizador: nuser, utilizador: user, tipo: tipo, date: moment(x.data), inicio: x.horainicio, fim: x.horafim, estado: estado})
        })
        setDataSource(temp)
        setFilteredResults(temp)
        setLoading(false)
        setWaitAxios(false)
      }).catch(error => {
        setDataSource([{}])
        setFilteredResults([{}])
        setLoading(false)
        if(isDebugging()) console.log(error)
      })
  }

  const columns = [
    {
      title: 'Sala',
      dataIndex: 'sala',
      sorter: (a, b) => (a.sala > b.sala) - (a.sala < b.sala),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Funcionario',
      dataIndex: 'utilizador',
      sorter: (a, b) => (a.utilizador > b.utilizador) - (a.utilizador < b.utilizador),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
      render: (_, { date }) => (
        <span>{moment(date).format("DD/MM/YYYY")}</span>
      ),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Inicio',
      dataIndex: 'inicio',
      sorter: (a, b) => (a.inicio > b.inicio) - (a.inicio < b.inicio),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Fim',
      dataIndex: 'fim',
      sorter: (a, b) => (a.fim > b.fim) - (a.fim < b.fim),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Serviço',
      key: 'tipo',
      dataIndex: 'tipo',
      filters: [
        {
          text: 'Limpeza',
          value: 'limpeza',
        },
        {
          text: 'Manutenção',
          value: 'manutencao',
        },
        {
          text: 'Diversos',
          value: 'diversos',
        },
      ],
      render: (_, { tipo }) => (
        <>
          {tipo ? (
          tipo.map((tag) => {
            if (tag === "limpeza") {
              return (<span className="text-sm bg-indigo-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Limpeza</span>)
            }else if (tag === "manutencao") {
              return (<span className="text-sm bg-pink-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Manutenção</span>)
            }else if(tag === "diversos"){
              return (<span className="text-sm bg-gray-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Diversos</span>)
            }else{
              return (<span></span>)
            }
          })) : <span className="text-sm bg-gray-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Indefinido</span>}
        </>
      ),
      onFilter: (value, record) => record.tipo.indexOf(value) === 0,
    },
    {
      title: 'Estado',
      key: 'estado',
      dataIndex: 'estado',
      filters: [
        {
          text: 'Cancelada',
          value: 'cancelado',
        },
        {
          text: 'Aguarda Serviço',
          value: 'aguarda',
        },
        {
          text: 'Limpa',
          value: 'limpo',
        },
        {
          text: 'Limpa e Desinfetada',
          value: 'desinfetado',
        },
        {
          text: 'Finalizada',
          value: 'concluido',
        },
        {
          text: 'Em atraso',
          value: 'atraso',
        },
      ],
      render: (_, { estado }) => (
        <>
          {estado ? (
          estado.map((tag) => {
            if (tag === "cancelado") {
              return (<span className="text-sm bg-gray-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Cancelada</span>)
            }else if (tag === "aguarda") {
              return (
              <button class="button__loader rounded-full py-1 px-4">
                <span class="whitespace-nowrap text-sm button__text">
                  Aguarda Serviço
                </span>
              </button>)
            }else if(tag === "limpo"){
              return (<span className="text-sm bg-green-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Limpa</span>)
            }else if(tag === "desinfetado"){
              return (<span className="whitespace-nowrap text-sm bg-green-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Limpa e Desinfetada</span>)
            }else if(tag === "concluido"){
              return (<span className="text-sm bg-green-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Finalizada</span>)
            }else if(tag === "atraso"){
              return (<span className="whitespace-nowrap text-sm bg-red-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Em atraso</span>)
            }else{
              return (<span></span>)
            }
          })) : <span className="text-sm bg-gray-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Indefinido</span>}
        </>
      ),
      onFilter: (value, record) => record.estado.indexOf(value) === 0,
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
        axios.delete(urlBase() + "pedidos/delete/" + key)
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
            const pedido = dataSource.find((item) => item.key === key)
            insertLogs('pedido', 'delete', pedido.sala)
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
        <AddPedido reloadTable={loadTable} />
      </div>
      <div id='Pag'>
        <EditPedido show={show} key={chave} id={chave} reloadTable={loadTable} callHide={callHide} />
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

