import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// 🔹 Horarios disponibles del médico
export const obtenerAgendaDisponible = async (idUsuarioMedico) => {
  const response = await axios.get(
    `${API_URL}/agendas/disponible/${idUsuarioMedico}/`
  );
  return response.data; // lista de { id_agenda, fecha, hora }
};

// 🔹 Agendar cita (usa /citas/agendar/ del backend)
export const agendarCita = async (idUsuarioPaciente, idUsuarioMedico, idAgenda) => {
  const response = await axios.post(`${API_URL}/citas/agendar/`, {
    id_usuario_paciente: idUsuarioPaciente,
    id_usuario_medico: idUsuarioMedico,
    id_agenda: idAgenda,
  });
  // backend devuelve { "id_cita": X }
  return response.data;
};

// (Opcionales pero listos para usar luego)

// Citas del paciente
export const listarCitasPaciente = async (idUsuarioPaciente) => {
  const response = await axios.get(
    `${API_URL}/citas/paciente/${idUsuarioPaciente}/`
  );
  return response.data;
};

// Citas del médico
export const listarCitasMedico = async (idUsuarioMedico) => {
  const response = await axios.get(
    `${API_URL}/citas/medico/${idUsuarioMedico}/`
  );
  return response.data;
};

// Cancelar cita
export const cancelarCita = async (idCita) => {
  const response = await axios.post(`${API_URL}/citas/cancelar/`, {
    id_cita: idCita,
  });
  return response.data;
};
