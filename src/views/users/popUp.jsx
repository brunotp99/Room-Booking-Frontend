import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'

export function popUp({
    count, 
    logs,
    show,
    callHide
}) {
  let [isOpen, setIsOpen] = useState(false)
  let status = show
  useEffect(() => {
    if (status == true) {
      openModal()
      status = false
      callHide()
    }
  }, [status]);

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const checkLength = (txt) => {
    if(txt.toString().length > 0) return true
    return false
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {count >= 1 ? "Utilizadores Adicionados com Sucesso!":"Utilizador Adicionado com Sucesso!"}
                  </Dialog.Title>
                  <div className="mt-2">
                    <h4 className="text-gray-500">
                      {logs.length != 0 ? "A importação gerou os seguintes problemas:":"A importação não gerou nenhum erro."}
                    </h4>
                      <ol className={logs.length != 0 ? 'popup ml-3 bg-blue-100 rounded-md p-3':''} >
                        {
                          logs.map((x, index) => {
                            return(
                              <>
                                {checkLength(x.user) ? <li className='popup' key={index}><bold className='font-medium'>{index+1}. Utilizador:</bold> {x.user} <div className='ml-3'><bold className='font-medium'>Motivo:</bold> {x.message}</div></li>
                                : <li className='popup' key={index}><div className='ml-3'><bold className='font-medium'>Atenção:</bold> {x.message}</div></li>}
                              </>
                            )                  
                          })
                        }
                      </ol>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Entendi
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default popUp