'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, CheckCircle2, AlertCircle, User, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

interface CitaDetalle {
  id: number
  paciente: {
    id: number
    nombre: string
    apellido: string
    fecha_nacimiento: string
    alergias?: string
  }
  fecha: string
  hora: string
  motivo: string
  estado: string
}

export default function ConsultaPage() {
  const router = useRouter()
  const params = useParams()
  const citaId = params.id
  
  const [cita, setCita] = useState<CitaDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    diagnostico: '',
    tratamiento: '',
    receta: '',
    notas: '',
    proxima_cita: '',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/historia-entrada/crear/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            cita_id: citaId,
            paciente_id: cita?.paciente.id,
            ...formData,
          }),
        }
      )

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/medico/dashboard')
        }, 2000)
      } else {
        setError('Error al guardar la consulta. Por favor, intenta de nuevo.')
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Por favor, intenta de nuevo.')
    } finally {
      setSaving(false)
    }
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

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-sans text-2xl font-bold text-foreground">Consulta Guardada</h2>
            <p className="text-muted-foreground">
              La información de la consulta ha sido registrada exitosamente
            </p>
          </CardContent>
        </Card>
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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/medico/dashboard">
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
            <h1 className="text-balance font-sans text-3xl font-bold text-foreground">Consulta Médica</h1>
            <p className="mt-2 text-muted-foreground">Registra los detalles de la consulta</p>
          </div>

          {/* Paciente Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Información del Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {cita.paciente.nombre} {cita.paciente.apellido}
                    </p>
                    <p className="text-sm text-muted-foreground">Paciente</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{cita.fecha}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{cita.hora}</span>
                  </div>
                </div>
              </div>
              {cita.paciente.alergias && (
                <Alert className="mt-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Alergias:</strong> {cita.paciente.alergias}
                  </AlertDescription>
                </Alert>
              )}
              <div className="mt-4 rounded-lg bg-muted p-3">
                <p className="text-sm font-medium text-foreground">Motivo de la consulta:</p>
                <p className="mt-1 text-sm text-muted-foreground">{cita.motivo}</p>
              </div>
            </CardContent>
          </Card>

          {/* Consulta Form */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Consulta</CardTitle>
              <CardDescription>Completa la información de diagnóstico y tratamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="diagnostico">Diagnóstico</Label>
                  <Textarea
                    id="diagnostico"
                    placeholder="Describe el diagnóstico del paciente..."
                    value={formData.diagnostico}
                    onChange={(e) => setFormData((prev) => ({ ...prev, diagnostico: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tratamiento">Tratamiento</Label>
                  <Textarea
                    id="tratamiento"
                    placeholder="Indica el tratamiento recomendado..."
                    value={formData.tratamiento}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tratamiento: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receta">Receta Médica</Label>
                  <Textarea
                    id="receta"
                    placeholder="Medicamentos prescritos y dosis..."
                    value={formData.receta}
                    onChange={(e) => setFormData((prev) => ({ ...prev, receta: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Textarea
                    id="notas"
                    placeholder="Observaciones o recomendaciones adicionales..."
                    value={formData.notas}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notas: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proxima_cita">Próxima Cita (Opcional)</Label>
                  <Input
                    id="proxima_cita"
                    type="date"
                    value={formData.proxima_cita}
                    onChange={(e) => setFormData((prev) => ({ ...prev, proxima_cita: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="w-full gap-2" disabled={saving}>
                    <Save className="h-4 w-4" />
                    {saving ? 'Guardando...' : 'Guardar Consulta'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
