import { Link } from "react-router-dom";

export default function navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success" to="/">
          SaludRural
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/agendar">Agendar Cita</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/medicos">Médicos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/paciente">Mi Cuenta</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}