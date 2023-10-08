import resolveConfig from 'tailwindcss/resolveConfig';
import axios from 'axios'
import AuthService from '../../src/views/auth/auth.service'
import authHeader from '../views/auth/auth-header';
import {locais, firstLocal} from '../views/hooks/Locais';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import { useAuth } from '../views/hooks/useAuth';

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig('./src/css/tailwind.config.js')
}

export const formatValue = (value) => Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const urlBase = () => {
  //return "http://localhost:24023/"
  return "https://softinsa-backend.herokuapp.com/"
}

export const defineLocal = () => {
  const local = localStorage.getItem("local")
  if(local){
    return locais(local)
  }else{
    const local = firstLocal()
    localStorage.setItem("local", local)
    return local
  }
}

export const validateLocal = () => {
  const nestabelecimento = defineLocal()
  if(nestabelecimento == 0){
    console.log("Nao tem acesso!")
    const local = firstLocal()
    localStorage.setItem("local", local)
  }
}

export const isDebugging = () => {
  return false
}

export const insertLogs = (type, action, description) => {

  if(type != undefined || action != undefined){

    const user = JSON.parse(localStorage.getItem('auth'));
    if(user){
        const config = {
          headers: authHeader()
        };
        axios.get(urlBase() + "gestores/decoded", config)
        .then(res => {
            const nuser = res.data.data.nutilizador
            axios.post(urlBase() + "logs/create", {nutilizador: nuser, tipo: type, acao: action, descricao: description})
            .then(res => {
              if(isDebugging()) console.log(res)
              return true
            }).catch(error => { 
              if(isDebugging()) console.log(error)
              return false
            })
        }).catch(error => { 
          if(isDebugging()) console.log(error)
          return false
        })
    }else return false

  }else return false

}

export const roundedTime = (time) => {
  const start = moment(time);

  var remainder = 5 - (start.minute() % 5)
  if(start.format('mm').slice(-1).includes("0") || start.format('mm').slice(-1).includes("5"))
    remainder = 0;
  
  return moment(start).add(remainder, "minutes").format("HH:mm");
}