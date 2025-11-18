import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { Link } from "react-router-dom";

export default function PerfilMedico({ medico }) {
  return (
    <div className="row g-4">

      {/* FOTO */}
      <div className="col-md-4 d-flex flex-column align-items-center">
        <img
          src={medico.foto || "/default-doctor.png"}
          alt="Foto médico"
          className="img-fluid rounded shadow"
          style={{ maxHeight: "260px", objectFit: "cover" }}
        />
      </div>

      {/* INFORMACIÓN */}
      <div className="col-md-8">
        <Card>

          <h3 className="fw-bold text-success mb-2">
            Dr(a). {medico.nombre} {medico.apellidos}
          </h3>

          <p className="text-muted">
            Médico registrado — ID Usuario: {medico.id_usuario}
          </p>

          <hr />

          <p><strong>Vereda:</strong> {medico.vereda}</p>
          <p><strong>Años de experiencia:</strong> {medico.anios_experiencia}</p>

          <p className="fw-bold mt-3">Perfil Profesional:</p>
          <p style={{ whiteSpace: "pre-line" }}>{medico.descripcion_perfil}</p>

          <Link to={`/citas/agendar/${medico.id_usuario}`}>
            <Button color="success" className="mt-3 w-100">
              Agendar cita con este médico
            </Button>
          </Link>

        </Card>
      </div>

    </div>
  );
}
