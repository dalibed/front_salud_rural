'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ArrowLeft, FileText, User, Calendar, Phone, MapPin, Plus, Pill, Activity, Save } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Paciente {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  fecha_nacimiento: string
  direccion: string
  alergias?: string
  grupo_sanguineo?: string
}

interface HistoriaEntry {
  id: number
  fecha: string
  diagnostico: string
  tratamiento: string
  receta?: string
  notas?: string
  medico: string
}

export default function PacienteDetailPage() {
  const params = useParams()
  const pacienteId = params.id
  
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [historia, setHistoria] = useState<HistoriaEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newEntry, setNewEntry] = useState({
    diagnostico: '',
    tratamiento: '',
    receta: '',
    notas: '',
  })

  useEffect(() => {
    fetchPaciente()
    fetchHistoria()
  }, [pacienteId])

  const fetchPaciente = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/pacientes/${pacienteId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setPaciente(data)
      }
    } catch (error) {
      console.log('[v0] Error fetching paciente:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistoria = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/historia-clinica/paciente/${pacienteId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setHistoria(data)
      }
    } catch (error) {
      console.log('[v0] Error fetching historia:', error)
    }
  }

  const handleSaveEntry = async () => {
    setSaving(true)
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
            paciente_id: pacienteId,
            ...newEntry,
          }),
        }
      )

      if (response.ok) {
        await fetchHistoria()
        setNewEntry({ diagnostico: '', tratamiento: '', receta: '', notas: '' })
      }
    } catch (error) {
      console.log('[v0] Error saving entry:', error)
    } finally {
      setSaving(false)
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

  if (!paciente) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Paciente no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/medico/pacientes">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Pacientes
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-balance font-sans text-3xl font-bold text-foreground">
                {paciente.nombre} {paciente.apellido}
              </h1>
              <p className="text-muted-foreground">
                {calcularEdad(paciente.fecha_nacimiento)} años
              </p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Entrada
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Entrada a Historia Clínica</DialogTitle>
                <DialogDescription>
                  Registra diagnóstico, tratamiento y notas adicionales
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnostico">Diagnóstico</Label>
                  <Textarea
                    id="diagnostico"
                    placeholder="Describe el diagnóstico..."
                    value={newEntry.diagnostico}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, diagnostico: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tratamiento">Tratamiento</Label>
                  <Textarea
                    id="tratamiento"
                    placeholder="Indica el tratamiento..."
                    value={newEntry.tratamiento}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, tratamiento: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receta">Receta</Label>
                  <Textarea
                    id="receta"
                    placeholder="Medicamentos prescritos..."
                    value={newEntry.receta}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, receta: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    placeholder="Observaciones adicionales..."
                    value={newEntry.notas}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, notas: e.target.value }))}
                    rows={2}
                  />
                </div>
                <Button onClick={handleSaveEntry} disabled={saving} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Guardando...' : 'Guardar Entrada'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">Información Personal</TabsTrigger>
            <TabsTrigger value="historia">Historia Clínica</TabsTrigger>
            <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Datos Personales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{paciente.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{paciente.fecha_nacimiento}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-foreground">{paciente.direccion}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información Médica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paciente.grupo_sanguineo && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Grupo Sanguíneo</p>
                      <p className="text-foreground">{paciente.grupo_sanguineo}</p>
                    </div>
                  )}
                  {paciente.alergias ? (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alergias</p>
                      <Badge variant="destructive" className="mt-1">
                        {paciente.alergias}
                      </Badge>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Alergias</p>
                      <p className="text-sm text-muted-foreground">No registradas</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="historia">
            {historia.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No hay entradas en la historia clínica</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-4">
                        Agregar Primera Entrada
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Agregar Entrada a Historia Clínica</DialogTitle>
                        <DialogDescription>
                          Registra diagnóstico, tratamiento y notas adicionales
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="diagnostico-empty">Diagnóstico</Label>
                          <Textarea
                            id="diagnostico-empty"
                            placeholder="Describe el diagnóstico..."
                            value={newEntry.diagnostico}
                            onChange={(e) => setNewEntry((prev) => ({ ...prev, diagnostico: e.target.value }))}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tratamiento-empty">Tratamiento</Label>
                          <Textarea
                            id="tratamiento-empty"
                            placeholder="Indica el tratamiento..."
                            value={newEntry.tratamiento}
                            onChange={(e) => setNewEntry((prev) => ({ ...prev, tratamiento: e.target.value }))}
                            rows={2}
                          />
                        </div>
                        <Button onClick={handleSaveEntry} disabled={saving} className="w-full gap-2">
                          <Save className="h-4 w-4" />
                          {saving ? 'Guardando...' : 'Guardar Entrada'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {historia.map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{entry.diagnostico}</CardTitle>
                          <CardDescription>Dr. {entry.medico}</CardDescription>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          {entry.fecha}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-foreground">Tratamiento</h4>
                        <p className="text-sm text-muted-foreground">{entry.tratamiento}</p>
                      </div>
                      {entry.receta && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-foreground">Receta Médica</h4>
                          <p className="text-sm text-muted-foreground">{entry.receta}</p>
                        </div>
                      )}
                      {entry.notas && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-foreground">Notas</h4>
                          <p className="text-sm text-muted-foreground">{entry.notas}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="medicamentos">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Pill className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No hay medicamentos activos registrados</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
