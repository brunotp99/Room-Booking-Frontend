import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { isDebugging, urlBase } from '../../utils/Utils';
import parse from 'html-react-parser'
import { MdDelete } from 'react-icons/md'
import moment from 'moment';
import { List } from 'antd';
import { itemRender } from '../tables/pagination'
import Loading from '../actions/SimpleLoading';
import authHeader from '../auth/auth-header';

function LogList() {

    const [isLoading, setIsLoading] = useState(true)
    const [logs, setLogs] = useState([{}])

    useEffect(() => {
      getLogs()
    }, [])

    const getLogs = () => {

      axios.get(urlBase() + "logs/list")
        .then(res => {
          const dados = res.data.data
          setLogs(dados)
          setIsLoading(false)
        })
        .catch(error => {
          if(isDebugging()) console.log(error)
          setIsLoading(false)
        })

    }

    const matchString = (user, tipo, acao, descricao, data) => {
      var line = ""
      var info = descricao
      if(descricao == undefined) info = "Desconhecido"

      switch(tipo){
        case 'user': 
          switch(acao){
            case 'create': line = `<span className="font-medium text-slate-800">` + user + `</span> adicionou o utilizador <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'bulk': line = `<span className="font-medium text-slate-800">` + user + `</span> adicionou <span className="font-medium text-slate-800">` + info + `</span> utilizadores por bulkInsert`; break
            case 'edit': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o utilizador <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'status_delete': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o estado do utilizador <span className="font-medium text-slate-800">` + info + ` para <span className="font-medium text-slate-800">Desativado</span></span>`; break
            case 'status_active': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o estado do utilizador <span className="font-medium text-slate-800">` + info + ` para <span className="font-medium text-slate-800">Ativado</span></span>`; break
            case 'delete': line = `<span className="font-medium text-slate-800">` + user + `</span> removeu o utilizador <span className="font-medium text-slate-800">` + info + `</span>`; break
            default: line = `<span className="font-medium text-slate-800">` + user + `</span> fez uma acção <span className="font-medium text-slate-800">Desconhecida</span>`; break
          }
        break
        case 'reserva': 
          switch(acao){
            case 'create': line = `<span className="font-medium text-slate-800">` + user + `</span> adicionou uma reserva para <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'edit': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou uma reserva para <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'end': line = `<span className="font-medium text-slate-800">` + user + `</span> terminou uma reserva de <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'delete': line = `<span className="font-medium text-slate-800">` + user + `</span> removeu uma reserva de <span className="font-medium text-slate-800">` + info + `</span>`; break
            default: line = `<span className="font-medium text-slate-800">` + user + `</span> fez uma acção <span className="font-medium text-slate-800">Desconhecida</span>`; break
          }
        break
        case 'sala': 
          switch(acao){
            case 'create': line = `<span className="font-medium text-slate-800">` + user + `</span> adicionou a sala <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'edit': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou a sala <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'status_delete': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o estado da sala <span className="font-medium text-slate-800">` + info + `</span> para <span className="font-medium text-slate-800">Desativada</span> removendo todas as reservas`; break
            case 'status_keep': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o estado da sala <span className="font-medium text-slate-800">` + info + `</span> para <span className="font-medium text-slate-800">Desativada</span>`; break
            case 'status_active': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o estado da sala <span className="font-medium text-slate-800">` + info + `</span> para <span className="font-medium text-slate-800">Ativada</span>`; break
            case 'delete': line = `<span className="font-medium text-slate-800">` + user + `</span> removeu a sala <span className="font-medium text-slate-800">` + info + `</span>`; break
            default: line = `<span className="font-medium text-slate-800">` + user + `</span> fez uma acção <span className="font-medium text-slate-800">Desconhecida</span>`; break
          }
        break
        case 'estabelecimento': 
          switch(acao){
            case 'create': line = `<span className="font-medium text-slate-800">` + user + `</span> adicionou a sala <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'edit': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou a sala <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'status_delete': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o estado do estabelecimento <span className="font-medium text-slate-800">` + info + `</span> para <span className="font-medium text-slate-800">Desativado</span> removendo todas as associações`; break
            case 'status_keep': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o estado do estabelecimento <span className="font-medium text-slate-800">` + info + `</span> para <span className="font-medium text-slate-800">Desativado</span>`; break
            case 'status_active': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o estado do estabelecimento <span className="font-medium text-slate-800">` + info + `</span> para <span className="font-medium text-slate-800">Ativo</span>`; break
            case 'delete': line = `<span className="font-medium text-slate-800">` + user + `</span> removeu a sala <span className="font-medium text-slate-800">` + info + `</span>`; break
            default: line = `<span className="font-medium text-slate-800">` + user + `</span> fez uma acção <span className="font-medium text-slate-800">Desconhecida</span>`; break
          }
        break
        case 'pedido': 
          switch(acao){
            case 'create': line = `<span className="font-medium text-slate-800">` + user + `</span> adicionou um pedido para <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'edit': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou um pedido para <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'end': line = `<span className="font-medium text-slate-800">` + user + `</span> terminou um pedido de <span className="font-medium text-slate-800">` + info + `</span>`; break
            case 'delete': line = `<span className="font-medium text-slate-800">` + user + `</span> removeu um pedido para a sala <span className="font-medium text-slate-800">` + info + `</span>`; break
            default: line = `<span className="font-medium text-slate-800">` + user + `</span> fez uma acção <span className="font-medium text-slate-800">Desconhecida</span>`; break
          }
        break
        case 'dispositivo': 
        switch(acao){
          case 'edit': line = `<span className="font-medium text-slate-800">` + user + `</span> alterou o dispositivo <span className="font-medium text-slate-800">` + info + `</span>`; break
          case 'delete': line = `<span className="font-medium text-slate-800">` + user + `</span> removeu o despositivo <span className="font-medium text-slate-800">` + info + `</span>`; break
          default: line = `<span className="font-medium text-slate-800">` + user + `</span> fez uma acção <span className="font-medium text-slate-800">Desconhecida</span>`; break
        }
      break
        default: line = `<span className="font-medium text-slate-800">` + user + `</span> fez uma acção <span className="font-medium text-slate-800">Desconhecida</span>`; break
      }

      let icon = ""
      switch(acao){
        case 'create': icon = `<div className="w-9 h-9 rounded-full shrink-0 bg-green-400 my-2 mr-3"><span className="w-9 h-9 fill-current text-green-50 flex justify-center items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg></span></div>`; break
        case 'edit': icon = `<div className="w-9 h-9 rounded-full shrink-0 bg-amber-400 my-2 mr-3"><span className="w-9 h-9 fill-current text-amber-50 flex justify-center items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></span></div>`; break
        case 'status': icon = `<div className="w-9 h-9 rounded-full shrink-0 bg-amber-400 my-2 mr-3"><span className="w-9 h-9 fill-current text-amber-50 flex justify-center items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></span></div>`; break
        case 'status_delete': icon = `<div className="w-9 h-9 rounded-full shrink-0 bg-amber-400 my-2 mr-3"><span className="w-9 h-9 fill-current text-amber-50 flex justify-center items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></span></div>`; break
        case 'status_keep': icon = `<div className="w-9 h-9 rounded-full shrink-0 bg-amber-400 my-2 mr-3"><span className="w-9 h-9 fill-current text-amber-50 flex justify-center items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></span></div>`; break
        case 'status_active': icon = `<div className="w-9 h-9 rounded-full shrink-0 bg-amber-400 my-2 mr-3"><span className="w-9 h-9 fill-current text-amber-50 flex justify-center items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></span></div>`; break
        case 'end': icon = `<div className="w-9 h-9 rounded-full shrink-0 bg-red-400 my-2 mr-3"><span className="w-9 h-9 fill-current text-red-50 flex justify-center items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></span></div>`; break
        case 'delete': icon = `<div className="w-9 h-9 rounded-full shrink-0 bg-red-400 my-2 mr-3"><span className="w-9 h-9 fill-current text-red-50 flex justify-center items-center"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></span></div>`; break
      }

      if(line === "") return <></>
      return (
        <>
          <span className="flex px-2">
              {parse(icon)}
            <div className="grow flex items-center border-b border-slate-100 text-sm py-2">
              <div className="grow flex justify-between">
                <div className="self-center">{parse(line)}</div>
                <div className="shrink-0 self-end ml-2 flex gap-2 items-center">
                  <span className="font-light text-sm text-slate-400 hidden md:inline">{moment(data).format("DD-MM-YYYY HH:mm")}</span>
                </div>
              </div>
            </div>
          </span>
        </>
      )
    }

    return (
        <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
          <div className="p-3">
    
            <div id="Pag">
              {
                isLoading ? <Loading />
                :
                <List     
                  itemLayout="vertical"
                  size="small"
                  pagination={{
                    itemRender: itemRender,
                    pageSize: 10,
                  }}
                  dataSource={logs}
                  bordered={false}
                  split={false}
                  renderItem={(item) => (
                    <List.Item
                      key={item.nlog}
                    >
                      {matchString(item.utilizador.utilizador, item.tipo, item.acao, item.descricao, item.datahora)}
                    </List.Item>
                  )}
                />
              }
            </div>
    
          </div>
        </div>
      );

}

export default LogList;
