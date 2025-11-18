import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/medicos";

/**
 * Obtener listado de todos los médicos (solo datos públicos)
 */
export async function obtenerMedicos() {
  try {
    const res = await axios.get(API_URL + "/");
    return res.data;
  } catch (error) {
    console.error("Error obteniendo médicos:", error);
    throw error;
  }
}

/**
 * Obtener perfil completo de un médico por su ID_Usuario
 */
export async function obtenerPerfilMedico(idUsuario) {
  try {
    const res = await axios.get(`${API_URL}/${idUsuario}/`);
    return res.data;
  } catch (error) {
    console.error("Error obteniendo perfil del médico:", error);
    throw error;
  }
}
