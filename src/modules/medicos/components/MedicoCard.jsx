import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { Link } from "react-router-dom";

export default function MedicoCard({ medico }) {
  return (
    <Card>
      <h4 className="fw-bold">{medico.nombre} {medico.apellidos}</h4>
      <p><strong>Vereda:</strong> {medico.vereda ?? "No asignada"}</p>
      <p><strong>Estado:</strong> {medico.estado_validacion}</p>

      <Link to={`/medicos/perfil/${medico.id_usuario}`}>
        <Button>Ver perfil</Button>
      </Link>
    </Card>
  );
}
