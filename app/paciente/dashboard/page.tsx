'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video, FileText, User, LogOut, Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Cita {
  id: number
  medico: string
  especialidad: string
  fecha: string
  hora: string
  estado: 'programada' | 'completada' | 'cancelada'
  tipo: 'presencial' | 'videollamada'
}

export default function PacienteDashboard() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUsuario(JSON.parse(userData))

    // Fetch citas from API
    fetchCitas()
  }, [])

  const fetchCitas = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/citas/paciente/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setCitas(data)
      }
    } catch (error) {
      console.log('[v0] Error fetching citas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      programada: 'default',
      completada: 'secondary',
      cancelada: 'destructive',
    }
    return variants[estado] || 'default'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/paciente/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-sans text-lg font-semibold text-foreground">Portal Paciente</span>
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              <Link href="/paciente/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/paciente/citas">
                <Button variant="ghost" size="sm">Mis Citas</Button>
              </Link>
              <Link href="/paciente/historia">
                <Button variant="ghost" size="sm">Historia Clínica</Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="hidden items-center gap-2 md:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{usuario?.nombre} {usuario?.apellido}</p>
                <p className="text-xs text-muted-foreground">Paciente</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-balance font-sans text-3xl font-bold text-foreground">
            Bienvenido, {usuario?.nombre}
          </h1>
          <p className="mt-2 text-muted-foreground">Gestiona tus citas médicas y accede a tu historia clínica</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Link href="/paciente/agendar">
            <Card className="transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Agendar Cita</p>
                  <p className="text-sm text-muted-foreground">Nueva consulta</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/paciente/historia">
            <Card className="transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Historia Clínica</p>
                  <p className="text-sm text-muted-foreground">Ver registros</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/paciente/documentos">
            <Card className="transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Documentos</p>
                  <p className="text-sm text-muted-foreground">Resultados y recetas</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Próximas Citas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Próximas Citas</CardTitle>
                <CardDescription>Tus consultas programadas</CardDescription>
              </div>
              <Link href="/paciente/agendar">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Cita
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {citas.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">No tienes citas programadas</p>
                <Link href="/paciente/agendar">
                  <Button className="mt-4" variant="outline">Agendar Primera Cita</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {citas.map((cita) => (
                  <div
                    key={cita.id}
                    className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        {cita.tipo === 'videollamada' ? (
                          <Video className="h-6 w-6 text-primary" />
                        ) : (
                          <User className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{cita.medico}</p>
                        <p className="text-sm text-muted-foreground">{cita.especialidad}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {cita.fecha}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {cita.hora}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getEstadoBadge(cita.estado)}>
                        {cita.estado}
                      </Badge>
                      {cita.estado === 'programada' && cita.tipo === 'videollamada' && (
                        <Link href={`/videollamada/${cita.id}`}>
                          <Button size="sm" className="gap-2">
                            <Video className="h-4 w-4" />
                            Unirse
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
