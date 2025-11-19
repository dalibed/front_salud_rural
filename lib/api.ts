// API utility functions for backend communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.headers as HeadersInit),
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Redirect to login if unauthorized
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return response
}

// Citas API
export const citasAPI = {
  getPacienteCitas: () => fetchWithAuth('/api/citas/paciente/'),
  getMedicoCitas: () => fetchWithAuth('/api/citas/medico/'),
  getCita: (id: number) => fetchWithAuth(`/api/citas/${id}/`),
  crearCita: (data: any) => fetchWithAuth('/api/citas/crear/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Historia Clínica API
export const historiaAPI = {
  getPacienteHistoria: (pacienteId: number) => 
    fetchWithAuth(`/api/historia-clinica/paciente/${pacienteId}/`),
  crearEntrada: (data: any) => fetchWithAuth('/api/historia-entrada/crear/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Documentos API
export const documentosAPI = {
  getPacienteDocumentos: () => fetchWithAuth('/api/documentos/paciente/'),
  subirDocumento: (formData: FormData) => {
    const token = localStorage.getItem('token')
    return fetch(`${API_URL}/api/documentos/subir/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
  },
  eliminarDocumento: (id: number) => fetchWithAuth(`/api/documentos/${id}/`, {
    method: 'DELETE',
  }),
}

// Pacientes API
export const pacientesAPI = {
  getPaciente: (id: number) => fetchWithAuth(`/api/pacientes/${id}/`),
  getMedicoPacientes: () => fetchWithAuth('/api/medicos/pacientes/'),
}

// Médicos API
export const medicosAPI = {
  getMedicos: () => fetchWithAuth('/api/medicos/'),
  getEstadisticas: () => fetchWithAuth('/api/medicos/estadisticas/'),
}
