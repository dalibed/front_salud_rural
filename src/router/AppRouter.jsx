import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgendarCitaPage from "../modules/citas/pages/AgendarCitaPage";
import ListaMedicosPage from "../modules/medicos/pages/ListaMedicosPage";
import PerfilMedicoPage from "../modules/medicos/pages/PerfilMedicoPage";
import CitasPacientePage from "../modules/citas/pages/CitasPacientePage";
import CitasMedicoPage from "../modules/citas/pages/CitasMedicoPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/citas/agendar/:id_usuario_medico" element={<AgendarCitaPage />} />
        <Route path="/medicos" element={<ListaMedicosPage />} />
        <Route path="/medicos/perfil/:id_usuario" element={<PerfilMedicoPage />} />
        <Route path="/paciente/citas" element={<CitasPacientePage />} />
        <Route path="/medico/citas" element={<CitasMedicoPage />} />

        
      </Routes>
    </BrowserRouter>
  );
}
