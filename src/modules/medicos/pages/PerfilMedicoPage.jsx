import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/ui/Loader";
import PageTitle from "../../../components/ui/PageTitle";
import PerfilMedico from "../components/PerfilMedico";
import { obtenerPerfilMedico } from "../services/apiMedicos";

export default function PerfilMedicoPage() {
  const { id_usuario } = useParams();
  const [medico, setMedico] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const data = await obtenerPerfilMedico(id_usuario);
        setMedico(data);
      } catch (err) {
        console.error("Error perfil medico:", err);
      } finally {
        setCargando(false);
      }
    }
    cargarPerfil();
  }, [id_usuario]);

  if (cargando) return <Loader />;

  if (!medico)
    return <p className="text-danger">No se pudo cargar el perfil del médico.</p>;

  return (
    <div className="container py-4">
      <PageTitle title="Perfil del Médico" />
      <PerfilMedico medico={medico} />
    </div>
  );
}
