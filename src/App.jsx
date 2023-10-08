import * as React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import './css/style.scss';
import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Reservas from './pages/Reservas';
import Utilizadores from './pages/Utilizadores';
import Salas from './pages/Salas'
import Estabelecimentos from './pages/Estabelecimentos'
import Dispositivos from './pages/Dispositivos'
import Error404 from './pages/Error404'
import Calendario from './pages/Calendario'
import Pedidos from './pages/Pedidos'
import Logs from './pages/Logs';
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './views/hooks/RequireAuth';
import PersistLogin from './views/hooks/PersistentLogin';
import Landing from './views/landing/Landing';
import Entrar from './pages/Entrar';

const Permissoes = {
  'Gestor': 0,
  'Admin': 1
}

const App = () => {

  return (
    <>
      <Routes>
        {/* Rotas Publicas */}
        <Route path="login" element={<Entrar />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="landing" element={<Landing />} />
        
        {/* Rotas Protegidas */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[Permissoes.Gestor, Permissoes.Admin]} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="reservas" element={<Reservas />} />
            <Route path="utilizadores" element={<Utilizadores />} />
            <Route path="salas" element={<Salas />} />
            <Route path="estabelecimentos" element={<Estabelecimentos />} />
            <Route path="dispositivos" element={<Dispositivos />} />
            <Route path="pedidos" element={<Pedidos />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[Permissoes.Admin]} />}>
            <Route path="estabelecimentos" element={<Estabelecimentos />} />
            <Route path="logs" element={<Logs />} />
          </Route>
        </Route>

        {/* Catch */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );

}

export default App;

