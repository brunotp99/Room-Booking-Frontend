import React, { useState } from 'react';
import Lost from '../images/not_found.svg'
import Img404 from '../images/404.png'
import { useNavigate } from "react-router-dom";

function Error404() {

  const navigate = useNavigate();

  return (
        <div className="h-screen w-screen bg-gray-100 flex items-center">
            <div className="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
                <div className="max-w-md">
                    <div className="text-5xl font-dark font-bold">404</div>
                        <p
                        className="text-2xl md:text-3xl font-light leading-normal"
                        >Desculpe, não encontramos a sua página! </p>
                        <p className="mb-8">A página que procura pode ter sido removida ou está incorreta!</p>
                        
                    <button className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700" onClick={()=>navigate('/')}>Voltar ao Inicio</button>
                </div>
                <div className="max-w-lg m-5">
                    <img src={Lost} />
                </div>
            
            </div>
        </div>
  );

}

export default Error404