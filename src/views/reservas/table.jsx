import React, { useEffect, useState } from 'react'
import { Table, Popconfirm } from 'antd'
import 'antd/dist/antd.css'
import '../tables/styles.css'
import { AddReserva } from './addReserva'
import { EditReserva } from './editReserva'
import { MdDelete } from 'react-icons/md'
import { MdModeEditOutline } from 'react-icons/md'
import { MdWarning } from 'react-icons/md'
import { MdModeEdit } from 'react-icons/md'
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

  const handleFinalizar = (nreserva, intervalo) => {
    Swal.fire({
      title: 'Atenção',
      text: "Tem a certeza que pretende finalizar a reserva?",
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

        const datapost = {
          nreserva: nreserva, 
          fim: moment(moment(), "HH:mm").format("HH:mm"),
          fimintervalo: intervalo
        }

        axios.post(urlBase() + "reservas/terminar", datapost)
          .then(res =>  {
            Swal.fire({
              title: 'Sucesso!',
              text: 'A reserva foi finalizada com sucesso!',
              icon: 'success',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
            loadTable()
            const reserva = dataSource.find((item) => item.key === nreserva)
            insertLogs('reserva', 'end', reserva.utilizador)
          }).catch(error => {
            if(isDebugging()) console.log(error)
            Swal.fire({
              title: 'Atenção!',
              text: 'Não foi possível finalizar a reserva!',
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
    axios.get(urlBase() + "reservas/todas/" + nestabelecimento)
      .then(res => {
        const tempSource = []
        const data = res.data.data
        data.map(x => {
          const estado = []
          estado.push(x.estadoreserva.toString())
          tempSource.push({key: x.nreserva, sala: x.sala.sala, utilizador: x.utilizadores.utilizador, date: moment(x.datareserva), inicio: x.horainicio, fim: x.horafim, intervalo: x.sala.intervalolimpeza, limpeza: x.sala.intervalolimpeza + " min", estado: estado})
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

  const columns = [
    {
      title: 'Sala',
      dataIndex: 'sala',
      sorter: (a, b) => (a.sala > b.sala) - (a.sala < b.sala),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Utilizador',
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
      title: 'Limpeza',
      dataIndex: 'limpeza',
      sorter: (a, b) => (a.limpeza > b.limpeza) - (a.limpeza < b.limpeza),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Estado',
      key: 'estado',
      dataIndex: 'estado',
      filters: [
        {
          text: 'Cancelada',
          value: '0',
        },
        {
          text: 'Agendada',
          value: '1',
        },
        {
          text: 'Concluída',
          value: '2',
        },
        {
          text: 'Em curso',
          value: '3',
        },
      ],
      render: (_, { estado, key, intervalo }) => (
        <>
          {estado ? (
          estado.map((tag) => {
            if (tag === "0") {
              return (<span className="text-sm bg-gray-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Cancelada</span>)
            }else if (tag === "1") {
              return (<span className="text-sm bg-blue-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Agendada</span>)
            }else if(tag === "2"){
              return (<span className="text-sm bg-purple-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Concluída</span>)
            }else if(tag === "3"){
              return (        
              <button type="button" onClick={()=>handleFinalizar(key, intervalo)} className="text-sm bg-red-400 text-white rounded-full py-1 mr-2 px-4 text-center inline-flex items-center">
                <MdModeEdit className="w-4 h-4 mr-2 -ml-1" />
                Em curso
              </button>)
            }else{
              return (<span className="text-sm bg-gray-400 text-white rounded-full py-1 mr-2 mb-2 px-4">Indefinido</span>)
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
      text: "Tem a certeza que pretende apagar a reserva?",
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
        axios.delete(urlBase() + "reservas/remover/" + key)
          .then(res => {
            Swal.fire({
              title: 'Sucesso!',
              text: 'A reserva foi apagada com sucesso!',
              icon: 'success',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
            setDataSource(newData)
            setFilteredResults(newData)
            setLoading(false)
            const reserva = dataSource.find((item) => item.key === key)
            insertLogs('reserva', 'delete', reserva.utilizador)
          }).catch(error => {
            if(isDebugging()) console.log(error)
            setLoading(false)
            Swal.fire({
              title: 'Atenção!',
              text: 'Não foi possível apagar a reserva!',
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
        <AddReserva reloadTable={loadTable} />
      </div>
      <div id='Pag'>
        <EditReserva show={show} key={chave} id={chave} reloadTable={loadTable} callHide={callHide} />
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
