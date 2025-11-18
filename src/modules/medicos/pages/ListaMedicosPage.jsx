import { useEffect, useState } from "react";
import Loader from "../../../components/ui/Loader";
import PageTitle from "../../../components/ui/PageTitle";
import MedicoCard from "../components/MedicoCard";
import { obtenerMedicos } from "../services/apiMedicos";

export default function ListaMedicosPage() {
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarData() {
      try {
        const data = await obtenerMedicos();
        setMedicos(data);
      } catch (err) {
        console.error("Error listando médicos:", err);
      } finally {
        setCargando(false);
      }
    }
    cargarData();
  }, []);

  if (cargando) return <Loader />;

  return (
    <div className="container py-4">
      <PageTitle title="Médicos disponibles" />

      <div className="row">
        {medicos.map((m) => (
          <div key={m.id_medico} className="col-md-4 mb-3">
            <MedicoCard medico={m} />
          </div>
        ))}
      </div>
    </div>
  );
}
