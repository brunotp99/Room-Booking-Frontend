import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import './styles.css'
import moment from "moment";
import './locale'
import axios from 'axios'
import { defineLocal, isDebugging, urlBase } from '../../utils/Utils';
import { Listbox, Transition } from '@headlessui/react'
import { TbSelector } from 'react-icons/tb'
import { AddReserva } from './addReserva'
import { EditReserva } from './editReserva'

moment.locale('pt')
const localizer = momentLocalizer(moment);

function Reservas() {

  const nestabelecimento = defineLocal()

  const [show, setShow] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [chave, setChave] = useState(0)
  const [selectedSala, setSelectedSala] = useState("")
  var idSala = 0
  const [salas, setSalas] = useState([])
  const [inicio, setInicio] = useState(new Date())
  const [fim, setFim] = useState(new Date())
  const [sala, setSala] = useState(idSala)
  const [Events, setEvents] = useState([
    {
      start: moment().toDate(),
      end: moment()
        .add(1, "days")
        .toDate(),
      title: "Some title"
    }
  ]);

    const loadReservas = () => {
      axios.get(urlBase() + "reservas/todas/" + nestabelecimento)
      .then(res => {
        const temp = []
        const data = res.data.data
        data.map(x => {
            var rgba = "rgba(37, 99, 235, 1)"
            if(x.estadoreserva == 2) rgba = "rgba(37, 99, 235, 0.8)"
            else if(x.estadoreserva == 3) rgba = "rgba(244, 67, 54, 1)"
            else if(x.estadoreserva == 0) rgba = "rgba(196, 196, 196, 0.8)"

            if(idSala == 0) temp.push({nreserva: x.nreserva, nsala: x.sala.nsala, title: x.sala.sala, start: moment(x.datareserva + " " + x.horainicio).toDate(), end: moment(x.datareserva + " " + x.horafim).toDate(), rgba: rgba})
            else{
              if(x.sala.nsala == idSala)
                temp.push({nreserva: x.nreserva, nsala: x.sala.nsala, title: x.sala.sala, start: moment(x.datareserva + " " + x.horainicio).toDate(), end: moment(x.datareserva + " " + x.horafim).toDate(), rgba: rgba})
            }
        })
        setEvents(temp)
      }).catch(error => {
        if(isDebugging()) console.log(error)
      })
    }

    useEffect(() => {
      loadReservas()
    }, [])

      const handleEventSelection = (e) => {
        setShowEdit(true)
        setChave(e.nreserva)
      };

      const handleSelectSlot = useCallback(
        ({ start, end }) => {
          setInicio(start)
          setFim(end)
          setShow(true)
        },
        [setEvents]
      )
    
      const { defaultDate, scrollToTime } = useMemo(
        () => ({
          defaultDate: new Date(2015, 3, 12),
          scrollToTime: new Date(1970, 1, 1, 6),
        }),
        []
      )

    const callHide = () => {
      setShow(false)
    }

    const callHideEdit = () => {
      setShowEdit(false)
    }

    const getSalas = () => {
      axios.get(urlBase() + "salas/estabelecimento/" + nestabelecimento)
        .then(res => {
          const tempSource = []
          const data = res.data.data
          tempSource.push({key: 0, sala: "Todas"})
          data.map(x => {
            tempSource.push({key: x.nsala, sala: x.sala})
          })
          if(tempSource.length != 0){
            setSelectedSala(tempSource[0].sala)
          }
          setSalas(tempSource)
        }).catch(error => {
          setSalas([{}])
          if(isDebugging()) console.log(error)
        })
    }

    useEffect(() => {
      getSalas()
    }, [])

    const HandleChange = (value) => {
      setSelectedSala(value)
      salas.map(x => {
        if(x.sala == value){
          idSala = x.key
        }
      })
      setSala(idSala)
      loadReservas()
    }

    const eventStyleGetter = (event, start, end, isSelected) => {
      var backgroundColor = event.rgba;
      var style = {
          backgroundColor: backgroundColor,
      };
      return {
          style: style
      };
   }

    return (
        <>
        <div className='pb-3 flex justify-end gap-3'>
          <AddReserva show={show} reloadTable={loadReservas} inicio={inicio} fim={fim} nsala={sala} callHide={callHide} />
          <EditReserva show={showEdit} key={chave} reloadTable={loadReservas} id={chave} callHide={callHideEdit} />
        </div>
        <div>
          <header className="py-4 border-b border-slate-100 flex justify-end">
            <div className="w-72">
              <Listbox as="div" value={selectedSala} onChange={value=>HandleChange(value)} >
                {({ open }) => (
                  <>
                    <div className="relative mt-1">
                      <span className="inline-block w-full">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">{selectedSala}</span>
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
                          className="index-100 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          {salas.map((sala) => (
                            <Listbox.Option className="" key={sala.key} value={sala.sala}>
                              {({ selected, active }) => (
                                <div
                                  className={`${
                                    active
                                      ? "text-white bg-blue-600"
                                      : "text-gray-900"
                                  } relative cursor-default select-none relative py-2 pl-10 pr-4`}
                                >
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-semibold" : "font-normal"
                                    }`}
                                  >
                                    {sala.sala}
                                  </span>

                                  {selected && (
                                    <span
                                      className={`${
                                        active ? "text-white" : "text-blue-600"
                                      } absolute inset-y-0 left-0 flex items-center pl-2`}
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
          </header>
          <Fragment>
            <div>
                <Calendar
                   localizer={localizer}
                   defaultDate={new Date()}
                   defaultView="week"
                   views={{
                    week: true,
                    day: true,               
                   }}
                   events={Events}
                   onSelectEvent={handleEventSelection}
                   onSelectSlot={handleSelectSlot}
                   dayLayoutAlgorithm={"no-overlap"}
                   selectable
                   scrollToTime={scrollToTime}
                   min={new Date("2022-01-01 09:00")}
                   max={new Date("2022-01-01 20:00")}
                   step={15}
                   allDayAccessor={false}
                   className='bg-white rounded-lg shadow-md p-3'
                   messages={{
                    next: ">",
                    previous: "<",
                    today: "Hoje",
                    month: "Més",
                    week: "Semana",
                    day: "Dia"
                  }}
                  eventPropGetter={eventStyleGetter}
                />
            </div>
          </Fragment>
        </div>
      </>
    )
}

export default Reservas