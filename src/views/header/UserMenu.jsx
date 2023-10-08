import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../../utils/Transition';
import AuthService from '../../views/auth/auth.service'
import { urlBase } from '../../utils/Utils';
import { EditUser } from './editUser'
import { EditSenha } from './editSenha'
import './styles.css'

function UserMenu() {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [show, setShow] = useState(false)
  const [showSenha, setShowSenha] = useState(false)
  const [nome, setNome] = useState("Desconhecido");
  const [cargo, setCargo] = useState("Desconhecido");
  const [imagem, setImagem] = useState("default.jpg");
  const [url, setUrl] = useState(urlBase() + "uploads/image/default.jpg")

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const callHide = () => {
    setShow(false)
    setDropdownOpen(false)
  }

  const callHideSenha = () => {
    setShowSenha(false)
    setDropdownOpen(false)
  }

  const handleEdit = (key) => {
    setDropdownOpen(false)
    setShow(true)
  };

  const handleSenha = () => {
    setDropdownOpen(false)
    setShowSenha(true)
  };

  const loadInfo = () => {
    const user = JSON.parse(localStorage.getItem('auth'));
    if (user) {
      if(user.nome != undefined) setNome(user.nome)
      if(user.cargo != undefined) setCargo(user.cargo)
      if(user.imagem != undefined){
        setImagem(user.imagem)
        setUrl(urlBase() + "uploads/image/" + imagem)
      }
    }
  }

  useEffect(() => {
    loadInfo()
  }, [nome, cargo, imagem, url])

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    if(!show || !showSenha){
      const keyHandler = ({ keyCode }) => {
        if (!dropdownOpen || keyCode !== 27) return;
        setDropdownOpen(false);
      };
      document.addEventListener('keydown', keyHandler);
      return () => document.removeEventListener('keydown', keyHandler);
    }
  });

  const sairConta = () => {
    AuthService.logout()
    setDropdownOpen(false);
  }

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <div className="picture-circle" style={{ backgroundImage: 'url('+ url +')' }} alt="User" ></div>
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium group-hover:text-slate-800">{nome}</span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
            <div className="font-medium text-slate-800">{nome}</div>
            <div className="text-xs text-slate-500 italic">{cargo}</div>
          </div>
          <ul>
            <li>
              <EditUser show={show} callHide={callHide} loadInfo={loadInfo} reloadImage={setImagem} />
              <button
                className="font-medium text-sm text-blue-500 hover:text-blue-600 flex items-center py-1 px-3"
                onClick={()=>handleEdit()}
              >
                Alterar Perfil
              </button>
            </li>
            <li>
              <EditSenha show={showSenha} callHide={callHideSenha} />
              <button
                className="font-medium text-sm text-blue-500 hover:text-blue-600 flex items-center py-1 px-3"
                onClick={()=>handleSenha()}
              >
                Alterar Senha
              </button>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-blue-500 hover:text-blue-600 flex items-center py-1 px-3"
                to='/login'
                onClick={() => sairConta()}
              >
                Sair
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default UserMenu;