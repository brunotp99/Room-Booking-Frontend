import React, { useEffect, useState } from 'react'
import { Table, Popconfirm } from 'antd'
import 'antd/dist/antd.css'
import '../tables/styles.css'
import { AddSala } from './addSala'
import { EditSala } from './editSala'
import { MdDelete } from 'react-icons/md'
import { MdModeEditOutline } from 'react-icons/md'
import { MdWarning } from 'react-icons/md'
import { MdModeEdit } from 'react-icons/md'
import axios from 'axios'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import locale from '../tables/translate'
import Swal from 'sweetalert2'
import { itemRender } from '../tables/pagination'
import Mensagem from '../actions/Mensagem'

function MyCSearchTable() {

  const [show, setShow] = useState(false)
  const [chave, setChave] = useState("0")
  const [dataSource, setDataSource] = useState([{}])
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState(dataSource);
  const nestabelecimento = defineLocal()
  const [loading, setLoading] = useState(true);
  const [waitAxios, setWaitAxios] = useState(true)

  const handleEdit = (key) => {
    setShow(true)
    setChave(key)
  };

  const [showMensagem, setShowMensagem] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [defineKey, setDefineKey] = useState(0);

  const notificarUtilizador = () => {
    setShowMensagem(true)
  }

  const handleState = (key, estado) => {

    if(estado == 1){

      Swal.fire({
        title: 'Atenção',
        text: 'Pretende remover todas as reservas associadas a esta sala?',
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
            setIsConfirmed(true)
            setDefineKey(key)
            notificarUtilizador()
          } else if (result.isDenied) {
            setIsConfirmed(false)
            setDefineKey(key)
            notificarUtilizador()
          }

    })
    }else{
      Swal.fire({
        title: 'Atenção!',
        text: "Tem a certeza que pretende reativar a sala?",
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
          axios.put(urlBase() + "salas/atualizar/estado/" + key)
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
                loadTable()
                const sala = dataSource.find((item) => item.key === key)
                insertLogs('sala', 'status_active', sala.sala)
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
      })
    }

  }

  useEffect(() => {
    loadTable()
  }, [])

  const loadTable = () => {
    setLoading(true)
    axios.get(urlBase() + "salas/estabelecimento/" + nestabelecimento)
      .then(res => {
        const tempSource = []
        const data = res.data.data
        data.map(x => {
          const atual = []
          const estado = []
          atual.push(x.nestado)
          estado.push(x.estadosala)
          tempSource.push({key: x.nsala, estado: estado, sala: x.sala, descricao: x.descricao, lugares: x.lugares, alocacao: x.alocacao + '%', intervalolimpeza: x.intervalolimpeza + ' min', atual: atual})
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
          Ativa
        </button>
      )
    }else if (x === 0) {
      return (
        <button type="button" onClick={()=>handleState(key, x)} className="text-white bg-red-400 hover:bg-red-500/90 font-sm rounded-full text-sm px-5 text-center inline-flex items-center py-1 mr-2 mb-2">
        <MdModeEdit className="w-4 h-4 mr-2 -ml-1" />
        Inativa
      </button>
      )
    }else{
      return (<span></span>)
    }
  }

  const EstadoAtual = (x, key) => {
    var texto = ""
    var cor = ""
    switch(parseInt(x)) {
      case 1:
        texto = "Dísponivel"
        cor = "green-400"
        break;
      case 2:
        texto = "Limpa"
        cor = "blue-400"
        break;
      case 3:
        texto = "Limpa e Desinfectada"
        cor = "blue-400"
        break;
      case 4:
        texto = "Aguarda Limpeza"
        cor = "indigo-400"
        break;
      case 5:
        texto = "Ocupada"
        cor = "amber-400"
        break;
      case 6:
        texto = "Bloqueada"
        cor = "red-400"
        break;
      default:
        texto = "Desconhecido"
        cor = "gray-400"
    }
    return <span className={ 'bg-' + cor + ' text-white font-sm rounded-full text-sm px-5 text-center inline-flex items-center py-1 mr-2 mb-2 whitespace-nowrap' }>{texto}</span>
  }

  const columns = [
    {
      title: 'Sala',
      dataIndex: 'sala',
      onFilter: (value, record) => record.nome.indexOf(value) === 0,
      sorter: (a, b) => ((a.sala > b.sala) - (a.sala < b.sala)),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
    },
    {
      title: 'Lugares',
      dataIndex: 'lugares',
    },
    {
      title: 'Alocação',
      dataIndex: 'alocacao',
    },
    {
      title: 'Intervalo de Limpeza',
      dataIndex: 'intervalolimpeza',
    },
    {
      title: 'Estado Atual',
      key: 'atual',
      dataIndex: 'atual',
      render: (_, record) =>
      dataSource.length >= 1 ? (
        EstadoAtual(parseInt(record.atual), record.key)
      ) : null,
    },
    {
      title: 'Estado',
      key: 'estado',
      render: (_, record) =>
      dataSource.length >= 1 ? (
        typeEstado(parseInt(record.estado), record.key)
      ) : null,
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
      text: "Tem a certeza que pretende apagar a sala? Todas as reservas associadas serão removidas!",
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
        axios.delete(urlBase() + "salas/remover/" + key)
        .then(res => {
          Swal.fire({
            title: 'Sucesso!',
            text: 'A sala foi apagada com sucesso!',
            icon: 'success',
            confirmButtonClass: "swal2-border-radius",
            confirmButtonColor: '#2d63ed',
            customClass: { popup: "swal2-border-radius",  },
          })
          setDataSource(newData)
          setFilteredResults(newData)
          setLoading(false)
          const sala = dataSource.find((item) => item.key === key)
          insertLogs('sala', 'delete', sala.sala)
        }).catch(error => {
          if(isDebugging()) console.log(error)
          setLoading(false)
          Swal.fire({
            title: 'Atenção!',
            text: 'Não foi possível apagar a sala!',
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
      <Mensagem 
        show={showMensagem} 
        close={() => setShowMensagem(false)} 
        isConfirmed={isConfirmed} 
        loadTable={loadTable} 
        dataSource={dataSource} 
        key={defineKey} 
        id={defineKey}
        title={"Sala Desativada"}
        type={"1"}
      />
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
        <AddSala reloadTable={loadTable} />
      </div>
      <div id='Pag'>
        <EditSala show={show} key={chave} id={chave} reloadTable={loadTable} callHide={callHide} />
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
