import React, {useState, useEffect} from 'react';
import BarChart from '../../charts/BarChart03';
import { defineLocal, isDebugging, urlBase } from '../../utils/Utils';
import axios from 'axios'
import SimpleLoading from '../actions/SimpleLoading';

function SalasMaisUtilizadas() {

  const [total, setTotal] = useState("0")
  const [isLoading, setIsLoading] = useState(true)

  const nestabelecimento = defineLocal()

  useEffect(() => {

    let nreservas = []

    axios.get(urlBase() + "algoritmos/chart/salas/" + nestabelecimento).then((response) => {
      const info = response.data.data
      info.map(x => {
        nreservas.push(parseInt(x.count))
      })
      if(nreservas != 0){
        const initialValue = 0;
        const sumWithInitial = nreservas.reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          initialValue
        );
        setTotal(sumWithInitial.toString())
      }else setTotal(0)
      setIsLoading(false)
    }).catch(error => {
      if(isDebugging()) console.log(error)
      setIsLoading(false)
    })

  }, [])

  return (
    <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
      {
      isLoading ? <SimpleLoading />
      : <>
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Salas mais utilizadas</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 mr-2">Reservas Totais {total}</div>
        </div>
      </div>
      <div className="grow">
        <BarChart width={595} height={48} />
      </div>
    </>}
    </div>
  );
}

export default SalasMaisUtilizadas;
