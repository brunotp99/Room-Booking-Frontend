import React, {useState, useEffect} from 'react';
import Flatpickr from 'react-flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';

// Import utilities
import { urlBase, defineLocal, isDebugging } from '../../utils/Utils';
import axios from 'axios'
import '../../css/style.css'

function RangeReservas() {

    const nestabelecimento = defineLocal()
    const [reservas, setReservas] = useState("0")

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    const getNReservas = (inicio, fim) => {
        const datapost = {
            inicio: inicio,
            fim: fim
        };
        axios.post(urlBase() + "reservas/count/totalreservas/" + nestabelecimento, datapost)
            .then(res => {
                const n = res.data.data
                setReservas(n)
                if(isDebugging()) console.log(n)
            }).catch(error => {
                if(isDebugging()) console.log(error)
            })
    }

    useEffect(() => {
        getNReservas(formatDate(new Date().setDate(new Date().getDate() - 14)), formatDate(new Date()))
    }, [])

    const options = {
        locale: {
          ...Portuguese,
        },
        mode: 'range',
        static: true,
        monthSelectorType: 'static',
        dateFormat: 'j M, Y',
        defaultDate: [new Date().setDate(new Date().getDate() - 14), new Date()],
        prevArrow: '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
        nextArrow: '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
        onReady: (selectedDates, dateStr, instance) => {
          instance.element.value = dateStr.replace('to', '-');
        },
        onChange: (selectedDates, dateStr, instance) => {
          instance.element.value = dateStr.replace('to', '-');
          getNReservas(formatDate(selectedDates[0]), formatDate(selectedDates[1]))
        },
      }

    return (
        <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-md">
          <div className="px-5 pt-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Número de reservas</h2>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Intervalo de Datas</div>
            <div className="">
                {/* Datepicker built with flatpickr */}
                <div className="relative">
                <Flatpickr className="width-100 form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300" options={options} />
                <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
                    <svg className="w-4 h-4 fill-current text-slate-500 ml-3" viewBox="0 0 16 16">
                    <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
                    </svg>
                </div>
                </div>
            </div>
          </div>
          {/* Chart built with Chart.js 3 */}
          <div className="p-3 flex justify-center items-center mt-0 xl:mt-10">
              <h1 className="text-3xl text-slate-800 mb-2"><span className='font-semibold '>{reservas}</span> Reservas</h1>
          </div>
        </div>
      );
}

export default RangeReservas;
