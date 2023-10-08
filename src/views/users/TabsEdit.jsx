import React, { useState, useEffect } from "react";
import { MdAddCircle } from 'react-icons/md'
import { MdRemoveCircle } from 'react-icons/md'
import axios from 'axios'
import { isDebugging, urlBase } from "../../utils/Utils";
import Swal from "sweetalert2";

export function Tabs({
  color,
  id,
  add,
  del
}) {

  const [openTab, setOpenTab] = React.useState(1);
  const [remover, setRemover] = useState([{}])
  const [adicionar, setAdicionar] = useState([{}])
  const [locais, setLocais] = useState([{}])

  useEffect(() => {
    getRemover()
    getAdicionar()
  }, [])

  const getRemover = () => {
    let locais = []
    axios.get(urlBase() + "algoritmos/table/user/estabelecimento/" + id)
      .then(res => {
          const data = res.data.data
          data.map(x => {
            locais.push({id: parseInt(x.nestabelecimento), name: x.estabelecimento})
          })
          setRemover(locais)
      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  const getAdicionar = () => {
    let locais = []
    axios.get(urlBase() + "algoritmos/table/user/sem/estabelecimento/" + id)
      .then(res => {
          const data = res.data.data
          data.map(x => {
            locais.push({id: parseInt(x.nestabelecimento), name: x.estabelecimento})
          })
          setAdicionar(locais)
          setLocais(locais)
      }).catch(error => { 
        if(isDebugging()) console.log(error)
      })
  }

  useEffect(() => {
    if(openTab == 1) setLocais(adicionar)
    if(openTab == 2) setLocais(remover)
  }, [openTab])

  function selectedAdicionar(event) {
    let value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    add(value.join(","))
  }

  function selectedRemover(event) {
    let value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    if(countLocais() || locais.length == value.length){
      del("erro")
    }else{
      del(value.join(","))
    }
  }

  const countLocais = () => {
    if(locais.length === 1) return true
    return false
  }

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1
                    ? "text-blue-700"
                    : "text-black")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Adicionar
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2
                    ? "text-blue-700"
                    : "text-black")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                 Remover
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                    <select multiple onChange={(e)=>selectedAdicionar(e)} id="countries_multiple" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {
                            locais.map((data, index) => {
                                return (<option key={index} value={data.id}>{data.name}</option>)
                            })
                        }
                    </select>
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                    <select multiple onChange={(e)=>selectedRemover(e)} id="countries_multiple" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {
                                locais.map((data, index) => {
                                    return (<option key={index} value={data.id} disabled={countLocais()}>{data.name}</option>)
                                })
                            }
                    </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs