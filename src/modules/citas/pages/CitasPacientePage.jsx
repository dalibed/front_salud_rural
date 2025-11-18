import { useEffect, useState } from "react";
import PageTitle from "../../../components/ui/PageTitle";
import CitaCardPaciente from "../components/CitaCardPaciente";
import { listarCitasPaciente, cancelarCita } from "../services/apiCitas";

export default function CitasPacientePage() {
  const idUsuarioPaciente = 3; // ⚠️ temporal hasta tener login
  const [citas, setCitas] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cargarCitas() {
    try {
      const data = await listarCitasPaciente(idUsuarioPaciente);
      setCitas(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCancelar(idCita) {
    try {
      await cancelarCita(idCita);
      setMensaje("Cita cancelada exitosamente.");
      cargarCitas();
    } catch (error) {
      setMensaje("Error cancelando cita.");
    }
  }

  return (
    <div className="container py-4">
      <PageTitle
        title="Mis Citas"
        subtitle="Consulta tus citas, estados y detalles"
      />

      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <div className="row g-3 mt-3">
        {citas.map((cita) => (
          <div key={cita.id_cita} className="col-md-6 col-lg-4">
            <CitaCardPaciente cita={cita} onCancelar={handleCancelar} />
          </div>
        ))}
      </div>
    </div>
  );
}
