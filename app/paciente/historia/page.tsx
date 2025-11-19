'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, FileText, Pill, Activity, Calendar } from 'lucide-react'
import Link from 'next/link'

interface HistoriaEntry {
  id: number
  fecha: string
  medico: string
  diagnostico: string
  tratamiento: string
  notas: string
}

export default function HistoriaClinicaPage() {
  const [historia, setHistoria] = useState<HistoriaEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistoria()
  }, [])

  const fetchHistoria = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/historia-clinica/paciente/`,
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/paciente/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-balance font-sans text-3xl font-bold text-foreground">Historia Clínica</h1>
          <p className="mt-2 text-muted-foreground">Accede a tu historial médico completo</p>
        </div>

        <Tabs defaultValue="consultas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="consultas" className="gap-2">
              <FileText className="h-4 w-4" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="medicamentos" className="gap-2">
              <Pill className="h-4 w-4" />
              Medicamentos
            </TabsTrigger>
            <TabsTrigger value="examenes" className="gap-2">
              <Activity className="h-4 w-4" />
              Exámenes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consultas">
            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Cargando...</p>
                  </div>
                </CardContent>
              </Card>
            ) : historia.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No hay registros en tu historia clínica</p>
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
                      {entry.notas && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-foreground">Notas Adicionales</h4>
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
                <p className="mt-4 text-muted-foreground">No hay medicamentos registrados</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examenes">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Activity className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">No hay exámenes registrados</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
