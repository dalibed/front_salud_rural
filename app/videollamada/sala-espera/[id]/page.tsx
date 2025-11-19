'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VideoCallPreview } from '@/components/video-call-preview'
import { ArrowLeft, Video, Calendar, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface CitaInfo {
  id: number
  fecha: string
  hora: string
  paciente?: { nombre: string; apellido: string }
  medico?: { nombre: string; apellido: string; especialidad: string }
  motivo: string
}

export default function SalaEsperaPage() {
  const params = useParams()
  const router = useRouter()
  const citaId = params.id
  
  const [cita, setCita] = useState<CitaInfo | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCita()
  }, [citaId])

  const fetchCita = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/citas/${citaId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setCita(data)
      }
    } catch (error) {
      console.log('[v0] Error fetching cita:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinCall = () => {
    router.push(`/videollamada/${citaId}`)
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

  if (!cita) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cita no encontrada</p>
      </div>
    )
  }

  const usuario = JSON.parse(localStorage.getItem('user') || '{}')
  const otroParticipante = usuario.tipo === 'medico' ? cita.paciente : cita.medico

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href={usuario.tipo === 'medico' ? '/medico/dashboard' : '/paciente/dashboard'}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-balance font-sans text-3xl font-bold text-foreground">
              Sala de Espera
            </h1>
            <p className="mt-2 text-muted-foreground">
              Prepárate para tu videoconsulta
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Video Preview */}
            <div>
              <VideoCallPreview onReady={() => setIsReady(true)} />
            </div>

            {/* Cita Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Cita</CardTitle>
                  <CardDescription>Detalles de tu consulta programada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {usuario.tipo === 'medico' ? 'Paciente' : 'Médico'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {otroParticipante?.nombre} {otroParticipante?.apellido}
                      </p>
                      {cita.medico?.especialidad && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {cita.medico.especialidad}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg bg-muted p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{cita.fecha}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{cita.hora}</span>
                    </div>
                  </div>

                  {cita.motivo && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-foreground">
                        Motivo de la consulta:
                      </p>
                      <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                        {cita.motivo}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consejos para la Videollamada</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Busca un lugar tranquilo con buena iluminación</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Asegúrate de tener una conexión estable a internet</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Ten a mano tus documentos médicos si es necesario</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Verifica que tu audio y video funcionen correctamente</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={handleJoinCall}
                disabled={!isReady}
                size="lg"
                className="w-full gap-2"
              >
                <Video className="h-5 w-5" />
                {isReady ? 'Unirse a la Videollamada' : 'Configurando...'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
