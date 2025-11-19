import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Calendar, FileText, Stethoscope, Users, Shield, Clock, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="font-sans text-xl font-bold text-foreground">Salud Rural</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#servicios" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Servicios
            </Link>
            <Link href="#caracteristicas" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Características
            </Link>
            <Link href="#contacto" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/registro">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Telemedicina Segura y Confiable</span>
          </div>
          <h1 className="text-balance font-sans text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Atención Médica de Calidad para Comunidades Rurales
          </h1>
          <p className="text-pretty text-lg text-muted-foreground md:text-xl">
            Conectamos pacientes en áreas rurales con médicos especializados a través de videoconsultas seguras,
            historias clínicas digitales y seguimiento continuo de salud.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/registro?tipo=paciente">
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Soy Paciente
              </Button>
            </Link>
            <Link href="/registro?tipo=medico">
              <Button size="lg" variant="outline" className="gap-2">
                <Stethoscope className="h-5 w-5" />
                Soy Médico
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="container py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-balance font-sans text-3xl font-bold text-foreground md:text-4xl">
              Servicios de Telemedicina
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Todo lo que necesitas para una atención médica completa desde la comodidad de tu hogar
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Video className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Videoconsultas</CardTitle>
                <CardDescription>
                  Consultas médicas en tiempo real con especialistas certificados
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Agendamiento</CardTitle>
                <CardDescription>
                  Sistema inteligente para agendar citas según tu disponibilidad
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Historia Clínica Digital</CardTitle>
                <CardDescription>
                  Acceso seguro a tus registros médicos desde cualquier lugar
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="bg-muted py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-balance font-sans text-3xl font-bold text-foreground md:text-4xl">
                ¿Por qué elegir Salud Rural?
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-sans text-xl font-semibold text-foreground">Atención 24/7</h3>
                  <p className="text-muted-foreground">
                    Médicos disponibles en todo momento para emergencias y consultas urgentes
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-sans text-xl font-semibold text-foreground">Cobertura Nacional</h3>
                  <p className="text-muted-foreground">
                    Alcance a comunidades rurales sin importar la distancia geográfica
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-sans text-xl font-semibold text-foreground">Seguridad Garantizada</h3>
                  <p className="text-muted-foreground">
                    Cifrado de extremo a extremo para proteger tu información médica
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-sans text-xl font-semibold text-foreground">Especialistas Certificados</h3>
                  <p className="text-muted-foreground">
                    Red de médicos verificados con experiencia en múltiples especialidades
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="mx-auto max-w-3xl border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
            <h2 className="text-balance font-sans text-3xl font-bold text-foreground md:text-4xl">
              Comienza tu atención médica hoy
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Regístrate gratis y agenda tu primera consulta con un especialista certificado
            </p>
            <Link href="/registro">
              <Button size="lg" className="gap-2">
                Registrarse Ahora
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              <span className="font-sans text-sm font-semibold text-foreground">Salud Rural</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Salud Rural. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
