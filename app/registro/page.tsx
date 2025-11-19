'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stethoscope, User, Mail, Lock, Phone, MapPin, AlertCircle } from 'lucide-react'

export default function RegistroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('paciente')
  
  useEffect(() => {
    const tipo = searchParams.get('tipo')
    if (tipo === 'medico' || tipo === 'paciente') {
      setActiveTab(tipo)
    }
  }, [searchParams])

  const [pacienteData, setPacienteData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
  })

  const [medicoData, setMedicoData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    especialidad: '',
    licencia: '',
  })

  const handlePacienteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/pacientes/registro/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pacienteData),
      })

      if (response.ok) {
        router.push('/login?mensaje=registro_exitoso')
      } else {
        setError('Error al registrar paciente. Por favor, intenta de nuevo.')
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleMedicoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/medicos/registro/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicoData),
      })

      if (response.ok) {
        router.push('/login?mensaje=registro_exitoso')
      } else {
        setError('Error al registrar médico. Por favor, intenta de nuevo.')
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="font-sans text-2xl font-bold text-foreground">Salud Rural</span>
          </div>
          <p className="text-sm text-muted-foreground">Crea tu cuenta para comenzar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>Selecciona tu tipo de cuenta y completa el formulario</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paciente">Paciente</TabsTrigger>
                <TabsTrigger value="medico">Médico</TabsTrigger>
              </TabsList>

              <TabsContent value="paciente">
                <form onSubmit={handlePacienteSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        placeholder="Juan"
                        value={pacienteData.nombre}
                        onChange={(e) => setPacienteData(prev => ({ ...prev, nombre: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        placeholder="Pérez"
                        value={pacienteData.apellido}
                        onChange={(e) => setPacienteData(prev => ({ ...prev, apellido: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-paciente">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-paciente"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10"
                        value={pacienteData.email}
                        onChange={(e) => setPacienteData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-paciente">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-paciente"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={pacienteData.password}
                        onChange={(e) => setPacienteData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="+591 12345678"
                          className="pl-10"
                          value={pacienteData.telefono}
                          onChange={(e) => setPacienteData(prev => ({ ...prev, telefono: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                      <Input
                        id="fecha_nacimiento"
                        type="date"
                        value={pacienteData.fecha_nacimiento}
                        onChange={(e) => setPacienteData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="direccion"
                        placeholder="Tu dirección completa"
                        className="pl-10"
                        value={pacienteData.direccion}
                        onChange={(e) => setPacienteData(prev => ({ ...prev, direccion: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse como Paciente'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="medico">
                <form onSubmit={handleMedicoSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre-medico">Nombre</Label>
                      <Input
                        id="nombre-medico"
                        placeholder="Dr. Juan"
                        value={medicoData.nombre}
                        onChange={(e) => setMedicoData(prev => ({ ...prev, nombre: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido-medico">Apellido</Label>
                      <Input
                        id="apellido-medico"
                        placeholder="Pérez"
                        value={medicoData.apellido}
                        onChange={(e) => setMedicoData(prev => ({ ...prev, apellido: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-medico">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-medico"
                        type="email"
                        placeholder="dr.tu@email.com"
                        className="pl-10"
                        value={medicoData.email}
                        onChange={(e) => setMedicoData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-medico">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-medico"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={medicoData.password}
                        onChange={(e) => setMedicoData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="telefono-medico">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="telefono-medico"
                          type="tel"
                          placeholder="+591 12345678"
                          className="pl-10"
                          value={medicoData.telefono}
                          onChange={(e) => setMedicoData(prev => ({ ...prev, telefono: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Select
                        value={medicoData.especialidad}
                        onValueChange={(value) => setMedicoData(prev => ({ ...prev, especialidad: value }))}
                      >
                        <SelectTrigger id="especialidad">
                          <SelectValue placeholder="Selecciona especialidad" />
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licencia">Número de Licencia Médica</Label>
                    <Input
                      id="licencia"
                      placeholder="Ej: LM-12345"
                      value={medicoData.licencia}
                      onChange={(e) => setMedicoData(prev => ({ ...prev, licencia: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse como Médico'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
