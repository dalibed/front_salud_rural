import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

export default function CitaCardPaciente({ cita, onCancelar }) {
  return (
    <Card>
      <h5 className="text-success">
        Cita con Dr(a). {cita.medico_nombre}
      </h5>

      <p className="mb-1">
        <strong>Fecha:</strong> {cita.fecha}
      </p>

      <p className="mb-1">
        <strong>Hora:</strong> {cita.hora}
      </p>

      <p className="mb-1">
        <strong>Estado:</strong> {cita.estado}
      </p>

      {cita.estado === "Programada" && (
        <Button
          color="danger"
          className="mt-2 w-100"
          onClick={() => onCancelar(cita.id_cita)}
        >
          Cancelar cita
        </Button>
      )}
    </Card>
  );
}
