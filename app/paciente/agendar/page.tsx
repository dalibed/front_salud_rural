'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Medico {
  id: number
  nombre: string
  apellido: string
  especialidad: string
}

export default function AgendarCitaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [formData, setFormData] = useState({
    especialidad: '',
    medico_id: '',
    fecha: undefined as Date | undefined,
    hora: '',
    tipo: 'videollamada',
    motivo: '',
  })

  useEffect(() => {
    fetchMedicos()
  }, [])

  const fetchMedicos = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/medicos/`
      )
      if (response.ok) {
        const data = await response.json()
        setMedicos(data)
      }
    } catch (error) {
      console.log('[v0] Error fetching medicos:', error)
    }
  }

  const medicosFiltrados = formData.especialidad
    ? medicos.filter((m) => m.especialidad === formData.especialidad)
    : medicos

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/citas/crear/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            fecha: formData.fecha?.toISOString().split('T')[0],
          }),
        }
      )

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/paciente/dashboard')
        }, 2000)
      } else {
        setError('Error al agendar la cita. Por favor, intenta de nuevo.')
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-sans text-2xl font-bold text-foreground">Cita Agendada</h2>
            <p className="text-muted-foreground">
              Tu cita ha sido programada exitosamente. Recibirás una confirmación por correo.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/paciente/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-balance font-sans text-3xl font-bold text-foreground">Agendar Nueva Cita</h1>
            <p className="mt-2 text-muted-foreground">Completa los siguientes pasos para programar tu consulta</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`h-0.5 w-12 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && 'Selecciona Especialidad y Médico'}
                {step === 2 && 'Elige Fecha y Hora'}
                {step === 3 && 'Confirma tu Cita'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Paso 1 de 3: Selecciona el especialista'}
                {step === 2 && 'Paso 2 de 3: Programa tu consulta'}
                {step === 3 && 'Paso 3 de 3: Revisa los detalles'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <Select
                      value={formData.especialidad}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, especialidad: value, medico_id: '' }))}
                    >
                      <SelectTrigger id="especialidad">
                        <SelectValue placeholder="Selecciona una especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicina-general">Medicina General</SelectItem>
                        <SelectItem value="pediatria">Pediatría</SelectItem>
                        <SelectItem value="ginecologia">Ginecología</SelectItem>
                        <SelectItem value="cardiologia">Cardiología</SelectItem>
                        <SelectItem value="dermatologia">Dermatología</SelectItem>
                        <SelectItem value="psicologia">Psicología</SelectItem>
                        <SelectItem value="nutricion">Nutrición</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medico">Médico</Label>
                    <Select
                      value={formData.medico_id}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, medico_id: value }))}
                      disabled={!formData.especialidad}
                    >
                      <SelectTrigger id="medico">
                        <SelectValue placeholder="Selecciona un médico" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicosFiltrados.map((medico) => (
                          <SelectItem key={medico.id} value={medico.id.toString()}>
                            Dr. {medico.nombre} {medico.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Consulta</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}
                    >
                      <SelectTrigger id="tipo">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="videollamada">Videollamada</SelectItem>
                        <SelectItem value="presencial">Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!formData.especialidad || !formData.medico_id}
                    className="w-full"
                  >
                    Continuar
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Calendar
                      mode="single"
                      selected={formData.fecha}
                      onSelect={(date) => setFormData((prev) => ({ ...prev, fecha: date }))}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora</Label>
                    <Select
                      value={formData.hora}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, hora: value }))}
                    >
                      <SelectTrigger id="hora">
                        <SelectValue placeholder="Selecciona una hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {horasDisponibles.map((hora) => (
                          <SelectItem key={hora} value={hora}>
                            {hora}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                      Atrás
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!formData.fecha || !formData.hora}
                      className="w-full"
                    >
                      Continuar
                    </Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="motivo">Motivo de la Consulta</Label>
                    <Textarea
                      id="motivo"
                      placeholder="Describe brevemente el motivo de tu consulta..."
                      value={formData.motivo}
                      onChange={(e) => setFormData((prev) => ({ ...prev, motivo: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="mb-3 font-semibold text-foreground">Resumen de la Cita</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Especialidad:</dt>
                        <dd className="font-medium text-foreground">{formData.especialidad}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Fecha:</dt>
                        <dd className="font-medium text-foreground">
                          {formData.fecha?.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Hora:</dt>
                        <dd className="font-medium text-foreground">{formData.hora}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Tipo:</dt>
                        <dd className="font-medium text-foreground">{formData.tipo}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                      Atrás
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                      {loading ? 'Agendando...' : 'Confirmar Cita'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
