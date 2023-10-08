import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Input, Button, Popconfirm } from 'antd'
import 'antd/dist/antd.css'
import '../tables/styles.css'
import { EditDispositivo } from './editDispositivo'
import { MdDelete } from 'react-icons/md'
import { MdModeEditOutline } from 'react-icons/md'
import { MdWarning } from 'react-icons/md'
import axios from 'axios'
import { defineLocal, insertLogs, isDebugging, urlBase } from '../../utils/Utils'
import locale from '../tables/translate'
import Swal from 'sweetalert2'
import { itemRender } from '../tables/pagination'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import './styles.css'

function MyCSearchTable() {

  const nestabelecimento = defineLocal()
  
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

  useEffect(() => {
    loadTable()
  }, [])

  const loadTable = () => {
    setLoading(true)
    axios.get(urlBase() + "tablets/list/estabelecimento/" + nestabelecimento)
      .then(res => {
        const tempSource = []
        const data = res.data.data
        data.map(x => {
          console.log(x.pin)
          tempSource.push({key: x.ntablet, sala: x.salas.sala, marca: x.marca, modelo: x.modelo, codigo: x.pin})
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
      title: 'Marca',
      dataIndex: 'marca',
      sorter: (a, b) => (a.marca > b.marca) - (a.marca < b.marca),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Modelo',
      dataIndex: 'modelo',
      sorter: (a, b) => (a.modelo > b.modelo) - (a.modelo < b.modelo),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Código',
      key: 'codigo',
      render: (_, record) =>
      dataSource.length >= 1 ? (
        <Input.Password
          value={record.codigo}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="hideCode"
          readOnly={true}
        />
      ) : null,
    },
    {
      title: 'Ação',
      key: 'action',
      render: (_, record) =>
      dataSource.length >= 1 ? (
        <div className='flex gap-2'>
          <button onClick={()=>handleEdit(record.key.toString())} class="transition-all rounded-full px-5 py-2.5 font-medium bg-yellow-50 hover:bg-yellow-500 hover:text-yellow-50 text-yellow-500 rounded-lg text-sm">
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
      text: "Tem a certeza que pretende apagar o dispositivo?",
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
        axios.delete(urlBase() + "tablets/remover/" + key)
          .then(res => {
            Swal.fire({
              title: 'Sucesso!',
              text: 'O dispositivo foi apagado com sucesso!',
              icon: 'success',
              confirmButtonClass: "swal2-border-radius",
              confirmButtonColor: '#2d63ed',
              customClass: { popup: "swal2-border-radius",  },
            })
            setDataSource(newData)
            setFilteredResults(newData)
            setLoading(false)
            const dispositivo = dataSource.find((item) => item.key === key)
            insertLogs('dispositivo', 'delete', dispositivo.marca + " " + dispositivo.modelo)
          }).catch(error => {
            if(isDebugging()) console.log(error)
            setLoading(false)
            Swal.fire({
              title: 'Atenção!',
              text: 'Não foi possível apagar o dispositivo!',
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
      <div id="Pag" className='pt-14'>
        <EditDispositivo show={show} key={chave} id={chave} reloadTable={loadTable} callHide={callHide} />
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
