import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageTitle from "../../../components/ui/PageTitle";
import HorariosDisponibles from "../components/HorariosDisponibles";

import { obtenerAgendaDisponible, agendarCita } from "../services/apiCitas";

export default function AgendarCitaPage() {

  const { id_usuario_medico } = useParams();
  const idUsuarioPaciente = 3; // temporal (hasta tener login)

  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerAgendaDisponible(id_usuario_medico);
        setHorarios(data);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id_usuario_medico]);

  async function handleSeleccion(h) {
    try {
      const data = await agendarCita(
        idUsuarioPaciente,
        id_usuario_medico,
        h.id_agenda
      );
      setMensaje("¡Cita agendada con éxito!");
      console.log("Resultado:", data);
    } catch (error) {
      setMensaje("Error al agendar: " + (error.response?.data?.detail || ""));
    }
  }

  return (
    <div className="container py-4">

      <PageTitle
        title="Agendar Cita"
        subtitle="Selecciona un horario disponible para tu cita"
      />

      {mensaje && (
        <div className="alert alert-info">{mensaje}</div>
      )}

      <HorariosDisponibles
        horarios={horarios}
        cargando={cargando}
        onSelect={handleSeleccion}
      />

    </div>
  );
}
