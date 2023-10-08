import react, { useEffect, useState } from 'react'
import logo from '../../images/loadingv6.gif'
import './css/loading.css'
import axios from 'axios'
import { urlBase } from '../../utils/Utils'
import Conexao from '../../pages/Conexao'

export default function Loading() {

    const [offline, setOffline] = useState(false)

    useEffect(() => {
        axios.get(urlBase())
        .then(res => {
        }).catch(error => {
            setOffline(true)
        })
    }, [])

    return(
        <>
        { !offline ? (
            <div id="spinner">
                <img src={logo} />
            </div>
        ) : <Conexao/>}
        </>
    
    )
}