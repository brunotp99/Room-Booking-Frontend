import React, { useState } from 'react';
import Lost from '../images/warning.svg'

function Conexao() {

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center">
        <div className="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
            <div className="max-w-md">
                <div className="text-5xl font-dark font-bold">503</div>
                    <p
                    className="text-2xl md:text-3xl font-light leading-normal"
                    >Desculpe, atualmente não foi possível apresentar os dados! </p>
                    <p className="mb-8">Por favor, verique a sua conexão com a internet ou contacte um administrador.</p>
                    
                <button className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700" onClick={() => window.location.reload()}>Recarregar</button>
            </div>
            <div className="max-w-lg m-5">
                <img src={Lost} />
            </div>
        
        </div>
    </div>
  );

}

export default Conexao