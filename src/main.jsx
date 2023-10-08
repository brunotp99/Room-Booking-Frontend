import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./views/hooks/useAuth";
import { ConfigProvider } from 'antd';
import ptPT from 'antd/es/locale/pt_PT';
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<ConfigProvider locale={ptPT}><App /></ConfigProvider>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)