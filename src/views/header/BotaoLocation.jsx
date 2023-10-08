import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Listbox } from '@headlessui/react'
import { TbSelector } from 'react-icons/tb'
import axios from 'axios'
import { isDebugging, urlBase } from '../../utils/Utils';
import authHeader from '../auth/auth-header';

export default function Example() {

  const [locais, setLocais] = useState([{}])
  const [selectedLocal, setSelectedLocal] = useState([])
  const [disable, setDisable] = useState(false)

  const getLocais = () => {
    let items = []
    const user = JSON.parse(localStorage.getItem('auth'));
    if(user){
      const config = {
        headers: authHeader()
      };
      axios.get(urlBase() + "users/locais", config)
        .then(res => {

            const dados = res.data.data
            dados.forEach(item => {
              items.push({id: parseInt(item.id), name: item.nome})
            })

            if(items.length === 0){
              items.push({id: 0, name: "Nenhum estabelecimento"})
              setDisable(true)
            }

            console.log(items)
            setLocais(items)
            
            if (localStorage.getItem("local") === null) {
              setSelectedLocal(items[0])
            }else{
              items.forEach(item => {
                if(item.id == parseInt(localStorage.getItem("local")))
                  setSelectedLocal(item)
              })
            }

        }).catch(error => { 
          if(isDebugging()) console.log(error)
        })
    }
  }

  useEffect(() => {
    getLocais()
  }, [])

  const HandleChange = (value) => {
    setSelectedLocal(value)
    localStorage.setItem("local", value.id);
    window.location.reload()
  }

  return (
      <div className="w-72">
        <Listbox as="div" value={selectedLocal} onChange={value=>HandleChange(value)} disabled={false} >
          {({ open }) => (
            <>
              <div className="relative mt-1">
                <span className="inline-block w-full">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedLocal.name}</span>
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
                    {locais.map((local) => (
                      <Listbox.Option className="" key={local.id} value={local}>
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
                              {local.name}
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
  )
}
