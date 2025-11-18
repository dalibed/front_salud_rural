import Loader from "../../../components/ui/Loader";

export default function HorariosDisponibles({ horarios, cargando, onSelect }) {
  
  if (cargando) return <Loader />;

  if (!horarios.length) {
    return <p className="text-danger">No hay horarios disponibles para este médico.</p>;
  }

  return (
    <div className="row g-3 mt-3">

      {horarios.map((h) => (
        <div key={h.id_agenda} className="col-6 col-md-3">

          <button
            className="btn btn-outline-success w-100 text-center"
            onClick={() => onSelect(h)}
          >
            <div>{h.fecha}</div>
            <strong>{h.hora}</strong>
          </button>

        </div>
      ))}

    </div>
  );
}
