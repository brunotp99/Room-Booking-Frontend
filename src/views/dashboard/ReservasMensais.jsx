import React, { useState, useEffect  } from 'react';
import BarChart from '../../charts/BarChart01';
import { defineLocal, isDebugging, urlBase } from '../../utils/Utils';
import { Listbox, Transition } from '@headlessui/react'
import { TbSelector } from 'react-icons/tb'
import axios from 'axios'
import moment from 'moment'
import SimpleLoading from '../actions/SimpleLoading';

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function ReservasMensais() {

  const d = new Date()
  const [selectedMes, setSelectedMes] = useState(meses[d.getMonth()])
  const [selectedAno, setSelectedAno] = useState(moment().format("YYYY").toString())
  const [anos, setAnos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const nestabelecimento = defineLocal()
  let setMes = d.getMonth()+1
  let ano = moment().format("YYYY").toString()

  const [chartValores, setChartValores] = useState([0])
  const [chartDatas, setChartDatas] = useState([
    '01-01-2022', '02-01-2022', '03-01-2022',
    '04-01-2022', '05-01-2022', '06-01-2022',
    '07-01-2022', '08-01-2022', '09-01-2022',
    '10-01-2022', '11-01-2022', '12-01-2022',
    '13-01-2022', '14-01-2022', '15-01-2022',
    '16-01-2022', '17-01-2022', '18-01-2022',
    '19-01-2022', '20-01-2022', '21-01-2022',
    '22-01-2022', '23-01-2022', '24-01-2022',
    '25-01-2022', '26-01-2022', '27-01-2022',
    '28-01-2022', '29-01-2022', '30-01-2022',
  ])

  const [chartBgCores, setChartBgCores] = useState([])
  const [chartHvCores, setChartHvCores] = useState([])

  const getMes = (valor) => {
    switch(valor){
      case "Janeiro": setMes = 1; break
      case "Fevereiro": setMes = 2; break
      case "Março": setMes = 3; break
      case "Abril": setMes = 4; break
      case "Maio": setMes = 5; break
      case "Junho": setMes = 6; break
      case "Julho": setMes = 7; break
      case "Agosto": setMes = 8; break
      case "Setembro": setMes = 9; break
      case "Outubro": setMes = 10; break
      case "Novembro": setMes = 11; break
      case "Dezembro": setMes = 12; break
    }
  }  

  const LoadData = () => {

    setChartValores([0])

    const postdata = {
      mes: setMes,
      ano: ano
    }
    axios.post(urlBase() + "algoritmos/chart/reservas/mes/" + nestabelecimento, postdata).then((response) => {
      const info = response.data.data

      let nreservas = []
      let datas = []
      let bgCores = []
      let hvCores = []

      var max = 0
      info.forEach(item => {
        if(item.nreservas > max)
          max = item.nreservas
      })

      var sum = 0
      info.forEach(item => {
        sum += parseInt(item.nreservas)
      })

      console.log(sum)

      for (const val of info){
        const myArray = val.data.split("-");
        datas.push((myArray[2]).toString() + "-01-2022")
        nreservas.push(Math.ceil((val.nreservas * 1.0 / sum) * 100))
        if((parseInt(val.nreservas) * 1.0 / max) * 100 >= 75){
          bgCores.push("#1dd1a1")
          hvCores.push("#10ac84")
        }else if((parseInt(val.nreservas) * 1.0 / max) * 100 >= 50){
          bgCores.push("#feca57")
          hvCores.push("#ff9f43")
        }else if((parseInt(val.nreservas) * 1.0 / max) * 100 >= 25){
          bgCores.push("#ff6b6b")
          hvCores.push("#ee5253")
        }else{
          bgCores.push("#c8d6e5")
          hvCores.push("#8395a7")
        }
      }

      setChartValores(nreservas)
      setChartDatas(datas)
      setChartBgCores(bgCores)
      setChartHvCores(hvCores)

    }).catch(error => {
      if(isDebugging()) console.log(error)
    });
  }

  const usedYears = () => {
    axios.get(urlBase() + "reservas/years/" + nestabelecimento)
      .then(res => {
        const data = res.data.data
        setAnos(data)
        setIsLoading(false)
      })
      .catch(error => {
        if(isDebugging()) console.log(error)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    LoadData()
  }, [])

  useEffect(() => {
    usedYears()
  }, [])

  const HandleChange = (value) => {
    setSelectedMes(value)
    getMes(value)
    LoadData()
  }

  const HandleYear = (value) => {
    setSelectedAno(value)
    ano = value
    LoadData()
  }

  const chartData = {
    labels: chartDatas,
    datasets: [
      {
        label: 'Reservas',
        data: chartValores,
        backgroundColor: chartBgCores, 
        hoverBackgroundColor: chartHvCores,
        barPercentage: 0.88,
        categoryPercentage: 0.66,
      },
    ],

  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 bg-white shadow-lg rounded-md">
    {
    isLoading ? <SimpleLoading />
    : <>
    <header className="px-5 py-4 border-b border-slate-100 flex justify-between">
      <h2 className="font-semibold text-slate-800">Alocação Diária</h2>
      <div className="w-72">
        <div className='flex flex-col-reverse sm:flex-row justify-end items-end gap-0 sm:gap-3'>
          {/* LISTBOX MESES */}
          <Listbox className="w-auto xs:w-60" as="div" value={selectedMes} onChange={value=>HandleChange(value)} >
            {({ open }) => (
              <>
                <div className="relative mt-1">
                  <span className="inline-block w-full">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedMes}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <TbSelector
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  </span>
                  <Transition
                    show={open}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      static
                      className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      {meses.map((mes) => (
                        <Listbox.Option className="" key={mes} value={mes}>
                          {({ selected, active }) => (
                            <div
                              className={`${
                                active
                                  ? "text-white bg-blue-600"
                                  : "text-gray-900"
                              } relative cursor-default select-none relative py-2 pl-2 xs:pl-10 pr-4`}
                            >
                              <span
                                className={`block truncate ${
                                  selected ? "font-semibold" : "font-normal"
                                }`}
                              >
                                {mes}
                              </span>

                              {selected && (
                                <span
                                  className={`${
                                    active ? "text-white" : "text-blue-600"
                                  } absolute inset-y-0 left-0 flex items-center pl-0 xs:pl-2 hidden xs:flex`}
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
          {/* LISTBOX ANOS */}
            <Listbox className="w-auto xs:w-40" as="div" value={selectedAno} onChange={value=>HandleYear(value)} >
            {({ open }) => (
              <>
                <div className="relative mt-1">
                  <span className="inline-block w-full">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{selectedAno}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <TbSelector
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  </span>
                  <Transition
                    show={open}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      static
                      className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      {anos.map((ano) => (
                        <Listbox.Option className="" key={ano} value={ano}>
                          {({ selected, active }) => (
                            <div
                              className={`${
                                active
                                  ? "text-white bg-blue-600"
                                  : "text-gray-900"
                              } relative cursor-default select-none relative py-2 pl-2 xs:pl-10 pr-4`}
                            >
                              <span
                                className={`block truncate ${
                                  selected ? "font-semibold" : "font-normal"
                                }`}
                              >
                                {ano}
                              </span>

                              {selected && (
                                <span
                                  className={`${
                                    active ? "text-white" : "text-blue-600"
                                  } absolute inset-y-0 left-0 flex items-center pl-0 xs:pl-2 hidden xs:flex`}
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
      </div>
    </header>
    <BarChart data={chartData} width={1000} height={248} />
  </>}
  </div>
  );
}

export default ReservasMensais;
