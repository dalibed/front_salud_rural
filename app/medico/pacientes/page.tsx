'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, User, Calendar, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Paciente {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  fecha_nacimiento: string
  direccion: string
  ultima_consulta?: string
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPacientes()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = pacientes.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPacientes(filtered)
    } else {
      setFilteredPacientes(pacientes)
    }
  }, [searchTerm, pacientes])

  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/medicos/pacientes/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setPacientes(data)
        setFilteredPacientes(data)
      }
    } catch (error) {
      console.log('[v0] Error fetching pacientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/medico/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-balance font-sans text-3xl font-bold text-foreground">Mis Pacientes</h1>
          <p className="mt-2 text-muted-foreground">Lista de pacientes bajo tu cuidado</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente por nombre o email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pacientes List */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredPacientes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <User className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                {searchTerm ? 'No se encontraron pacientes' : 'No tienes pacientes registrados'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPacientes.map((paciente) => (
              <Card key={paciente.id} className="transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {paciente.nombre} {paciente.apellido}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {calcularEdad(paciente.fecha_nacimiento)} años
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{paciente.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{paciente.direccion}</span>
                    </div>
                    {paciente.ultima_consulta && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Última: {paciente.ultima_consulta}</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/medico/paciente/${paciente.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Historia Clínica
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
