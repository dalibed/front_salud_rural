'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video, Users, FileText, LogOut, Bell, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Cita {
  id: number
  paciente: string
  fecha: string
  hora: string
  estado: 'programada' | 'completada' | 'cancelada'
  tipo: 'presencial' | 'videollamada'
  motivo: string
}

export default function MedicoDashboard() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)
  const [citas, setCitas] = useState<Cita[]>([])
  const [stats, setStats] = useState({
    citasHoy: 0,
    pacientesTotal: 0,
    consultasCompletadas: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUsuario(JSON.parse(userData))

    fetchCitas()
    fetchStats()
  }, [])

  const fetchCitas = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/citas/medico/`,
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

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/medicos/estadisticas/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.log('[v0] Error fetching stats:', error)
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
            <Link href="/medico/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-sans text-lg font-semibold text-foreground">Portal Médico</span>
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              <Link href="/medico/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/medico/agenda">
                <Button variant="ghost" size="sm">Agenda</Button>
              </Link>
              <Link href="/medico/pacientes">
                <Button variant="ghost" size="sm">Pacientes</Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="hidden items-center gap-2 md:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Dr. {usuario?.nombre} {usuario?.apellido}</p>
                <p className="text-xs text-muted-foreground">{usuario?.especialidad}</p>
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
            Bienvenido, Dr. {usuario?.nombre}
          </h1>
          <p className="mt-2 text-muted-foreground">Gestiona tus consultas y revisa tu agenda del día</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Citas Hoy</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.citasHoy}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pacientes Totales</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.pacientesTotal}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Consultas Completadas</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stats.consultasCompletadas}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agenda de Hoy</CardTitle>
                <CardDescription>Tus consultas programadas para hoy</CardDescription>
              </div>
              <Link href="/medico/agenda">
                <Button size="sm" variant="outline">Ver Agenda Completa</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {citas.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">No tienes citas programadas para hoy</p>
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
                          <Users className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{cita.paciente}</p>
                        <p className="text-sm text-muted-foreground">{cita.motivo}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {cita.hora}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {cita.tipo}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getEstadoBadge(cita.estado)}>
                        {cita.estado}
                      </Badge>
                      {cita.estado === 'programada' && (
                        <div className="flex gap-2">
                          <Link href={`/medico/consulta/${cita.id}`}>
                            <Button size="sm" variant="outline">
                              Ver Detalles
                            </Button>
                          </Link>
                          {cita.tipo === 'videollamada' && (
                            <Link href={`/videollamada/${cita.id}`}>
                              <Button size="sm" className="gap-2">
                                <Video className="h-4 w-4" />
                                Iniciar
                              </Button>
                            </Link>
                          )}
                        </div>
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
