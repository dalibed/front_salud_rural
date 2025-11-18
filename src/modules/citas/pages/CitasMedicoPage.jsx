import { useEffect, useState } from "react";
import PageTitle from "../../../components/ui/PageTitle";
import CitaCardMedico from "../components/CitaCardMedico";
import { listarCitasMedico } from "../services/apiCitas";

export default function CitasMedicoPage() {
  const idUsuarioMedico = 2; // ⚠️ temporal hasta login
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cargarCitas() {
    try {
      const data = await listarCitasMedico(idUsuarioMedico);
      setCitas(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container py-4">
      <PageTitle
        title="Mis Citas con Pacientes"
        subtitle="Consulta todas tus citas programadas"
      />

      <div className="row g-3 mt-3">
        {citas.map((cita) => (
          <div key={cita.id_cita} className="col-md-6 col-lg-4">
            <CitaCardMedico cita={cita} />
          </div>
        ))}
      </div>
    </div>
  );
}
