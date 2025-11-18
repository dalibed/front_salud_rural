import Card from "../../../components/ui/Card";

export default function CitaCardMedico({ cita }) {
  return (
    <Card>
      <h5 className="text-primary">
        Paciente: {cita.paciente_nombre}
      </h5>

      <p><strong>Fecha:</strong> {cita.fecha}</p>
      <p><strong>Hora:</strong> {cita.hora}</p>
      <p><strong>Estado:</strong> {cita.estado}</p>

      {/* Espacio para funciones futuras */}
      <div className="mt-3">
        <button className="btn btn-outline-success w-100 mb-2">
          Registrar historia clínica
        </button>

        <button className="btn btn-outline-primary w-100">
          Iniciar videollamada
        </button>
      </div>
    </Card>
  );
}
