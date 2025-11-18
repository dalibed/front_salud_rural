import { useEffect, useState } from "react";

import Loader from "../../../components/ui/Loader.jsx";
import Card from "../../../components/ui/Card.jsx";
import Button from "../../../components/ui/Button.jsx";
import PageTitle from "../../../components/ui/PageTitle.jsx";

import { obtenerAgendaDisponible, agendarCita } from "../services/apiCitas";

export default function AgendarCita({ idUsuarioPaciente, idUsuarioMedico }) {
  const [agenda, setAgenda] = useState([]);
  const [idAgendaSeleccionada, setIdAgendaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agendando, setAgendando] = useState(false);

  // 1) Cargar horarios disponibles del médico
  useEffect(() => {
    const cargarAgenda = async () => {
      try {
        const data = await obtenerAgendaDisponible(idUsuarioMedico);
        setAgenda(data);
      } catch (error) {
        console.error(error);
        alert("Error cargando la agenda del médico.");
      } finally {
        setLoading(false);
      }
    };

    cargarAgenda();
  }, [idUsuarioMedico]);

  // 2) Confirmar cita
  const handleAgendar = async () => {
    if (!idAgendaSeleccionada) {
      alert("Debes seleccionar un horario.");
      return;
    }

    setAgendando(true);
    try {
      const data = await agendarCita(
        idUsuarioPaciente,
        idUsuarioMedico,
        idAgendaSeleccionada
      );
      alert(`Cita agendada correctamente. ID de cita: ${data.id_cita}`);
      // Opcional: recargar agenda para que desaparezca la franja usada
      const nuevaAgenda = await obtenerAgendaDisponible(idUsuarioMedico);
      setAgenda(nuevaAgenda);
      setIdAgendaSeleccionada(null);
    } catch (error) {
      console.error(error);
      alert("No se pudo agendar la cita.");
    } finally {
      setAgendando(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-4">
      <PageTitle
        title="Agendar cita"
        subtitle="Selecciona una fecha y hora disponibles con tu médico."
      />

      <Card title="Horarios disponibles">
        {agenda.length === 0 && (
          <p className="text-muted mb-0">No hay horarios disponibles.</p>
        )}

        <div className="list-group">
          {agenda.map((slot) => (
            <button
              key={slot.id_agenda}
              type="button"
              className={`list-group-item list-group-item-action ${
                idAgendaSeleccionada === slot.id_agenda ? "active" : ""
              }`}
              onClick={() => setIdAgendaSeleccionada(slot.id_agenda)}
            >
              {slot.fecha} — {slot.hora}
            </button>
          ))}
        </div>
      </Card>

      <Button
        color="success"
        onClick={handleAgendar}
        type="button"
      >
        {agendando ? "Agendando..." : "Confirmar cita"}
      </Button>
    </div>
  );
}
