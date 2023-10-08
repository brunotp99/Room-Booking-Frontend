
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Transition } from '@headlessui/react'
import { urlBase } from "../../utils/Utils";
import './css/style.css'
import BgImage from './images/login.jpg'
import Swal from 'sweetalert2'
import { MdCopyright } from 'react-icons/md'
import authHeader from '../auth/auth-header';

export default function Formulario() {

    const { login } = useAuth();

    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [lembrar, setLembrar] = useState(false)
    const [message, setmessage] = useState("");
    const [isShowing, setIsShowing] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const setEmailLembrar = () => {
        var email = localStorage.getItem('email')
        if(email){
          setusername(email)
          setLembrar(true)
        }
    }

    const errorSlice = (msg) => {
      return msg.substr(7).toString()
    }

    const forcePassword = (accessToken, nome, cargo, imagem) => {
      Swal.fire({
          title: 'Alteração de Palavra-passe',
          text: 'Por favor, introduza a nova palavra-passe:',
          input: 'password',
          inputAttributes: {
              autocapitalize: 'off',
              placeholder: '********'
          },
          showCancelButton: true,
          confirmButtonText: 'Alterar',
          cancelButtonText: 'Cancelar',
          confirmButtonClass: "swal2-border-radius",
          cancelButtonClass: "swal2-border-radius",
          confirmButtonColor: '#2d63ed',
          cancelButtonColor: '#d33',
          showLoaderOnConfirm: true,
          customClass: { popup: "swal2-border-radius" },
          preConfirm: (password) => {
          const config = {
              headers: {Authorization: 'Bearer ' + accessToken}
          };
          return axios.post(urlBase() + 'users/gestor/force/senha', {nova: password}, config)
              .then(res => {
                if(res.data.success){
                  login({
                    accessToken, nome, cargo, imagem
                  });
                  navigate(from, { replace: true });
                  return res.data
                }else throw new Error(res.data.message)
              }).catch(error => {
                var msg = errorSlice(error.toString())
                if(msg.length === 0) msg = "Desculpe, não foi possível alterar a palavra-passe!"
                Swal.showValidationMessage(
                    msg
                )
              })
          },
          allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
          if (result.isConfirmed) {
          Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Sucesso!',
              text: 'A sua palavra-passe foi alterada com sucesso!',
              showConfirmButton: false,
              timer: 2000,
              customClass: { popup: "swal2-border-radius" }
          })
          }
      })
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setmessage("");
      try {
          const response = await axios.post(urlBase() + "users/gestor/login", { email: username, password: password });
          const accessToken = response?.data?.accessToken;
          const nome = response?.data?.nome;
          const cargo = response?.data?.cargo;
          const imagem = response?.data?.imagem;
          const verify = response?.data?.verify;
          
          setpassword('');
          if(lembrar) localStorage.setItem('email', username)

          if(verify == 0){
            forcePassword(accessToken, nome, cargo, imagem)
          }else{
            login({
              accessToken, nome, cargo, imagem
            });
            navigate(from, { replace: true });
          }

      } catch (err) {
          const motivo = err?.response?.data?.message
          if (!err?.response) {
            setmessage('Atualmente não é póssivel comunicar com o servidor. ' + err);
          } else {
            setmessage(motivo);
          }
      }
  }

    useEffect(() => {
        if(message != "") setIsShowing(true)
        else setIsShowing(false)
    }, [message])

    useEffect(() => {
      setEmailLembrar()
    }, [setusername])

   const forgotPassword = () => {
    Swal.fire({
      title: 'Recuperação de conta',
      text: 'Por favor, introduza o seu endereço e-mail:',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'nome@softinsa.pt'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonClass: "swal2-border-radius",
      cancelButtonClass: "swal2-border-radius",
      confirmButtonColor: '#2d63ed',
      cancelButtonColor: '#d33',
      showLoaderOnConfirm: true,
      customClass: { popup: "swal2-border-radius" },
      preConfirm: (email) => {
        return axios.post(urlBase() + 'send/email/recuperacao', {email: email})
          .then(res => {
            if(res.data.success)
              return res.data
            else throw new Error(res.data.message)
          }).catch(error => {
            var msg = errorSlice(error.toString())
            if(msg.length === 0) msg = "Desculpe, não foi possível efetuar o pedido de recuperação da palavra-passe!"
            Swal.showValidationMessage(
              msg
            )
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Sucesso!',
          text: 'Receberá em breve um e-mail com a sua nova palavra-passe temporária.',
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "swal2-border-radius" }
        })
      }
    })
  }

  return (
    <div id="Login">
      <div className="container">
        <input type="checkbox" id="flip" />
        <div className="cover">
          <div className="front">
            <img src={BgImage} alt="" />
            <div className="text">
              <span className="text-1">Reserve uma sala <br /> à sua medida</span>
              <span className="text-2"><MdCopyright className="inline"/> Softinsa</span>
            </div>
          </div>
          <div className="back">
          <img className="backImg" src={BgImage} alt="" />
          <div className="text">
              <span className="text-1">Reserve uma sala <br /> à sua medida</span>
              <span className="text-2"><MdCopyright className="inline"/> Softinsa</span>
          </div>
        </div>
        </div>
        <div className="forms">
            <div className="form-content">
              <div className="login-form">
              <Transition
                  show={isShowing}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
              >
                  <div id="alert-2" className="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200" role="alert">
                      <svg className="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                      <div className="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                          {message}
                      </div>
                      <button type="button" onClick={() => setIsShowing(false)} className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300" data-dismiss-target="#alert-2" aria-label="Close">
                          <span className="sr-only">Fechar</span>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                      </button>
                  </div>
              </Transition>
                <div className="title">Iniciar Sessão</div>
              <form onSubmit={handleSubmit}>
                <div className="input-boxes">
                  
                  <div className="mb-6">
                  <label htmlFor="email-address">Endereço e-mail</label>
                      <input value={username} onChange={(value) => setusername(value.target.value)} type="email" id="email" className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="nome@softinsa.pt" required />
                  </div>
                  <div className="mb-6">
                  <label htmlFor="email-address">Palavra-passe</label>
                      <input value={password} onChange={(value) => setpassword(value.target.value)} type="password" id="password" className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Palavra-passe" required />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={lembrar}
                      onChange={checked=>setLembrar(checked.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 text-decoration-none">
                      Lembrar
                    </label>
                  </div>
                  <div className="button input-box">
                    <input type="submit" value="Entrar" />
                  </div>
                  <div className="text sign-up-text"><a onClick={()=>forgotPassword()}>Esqueceu-se da palavra-passe?</a></div>
                </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  )

}
