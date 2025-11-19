'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, MessageSquare, Monitor, AlertCircle, Clock, User } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

interface Participante {
  nombre: string
  apellido: string
  tipo: 'medico' | 'paciente'
}

export default function VideollamadaPage() {
  const params = useParams()
  const router = useRouter()
  const citaId = params.id
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [error, setError] = useState('')
  const [duration, setDuration] = useState(0)
  const [participante, setParticipante] = useState<Participante | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    fetchCitaInfo()
    return () => {
      // Cleanup media streams on unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [citaId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const fetchCitaInfo = async () => {
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
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        
        // Determine the other participant
        if (user.tipo === 'medico') {
          setParticipante({
            nombre: data.paciente.nombre,
            apellido: data.paciente.apellido,
            tipo: 'paciente',
          })
        } else {
          setParticipante({
            nombre: data.medico.nombre,
            apellido: data.medico.apellido,
            tipo: 'medico',
          })
        }
      }
    } catch (error) {
      console.log('[v0] Error fetching cita info:', error)
      setError('Error al cargar información de la cita')
    }
  }

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      
      setLocalStream(stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      return true
    } catch (err) {
      console.log('[v0] Error accessing media devices:', err)
      setError('No se pudo acceder a la cámara o micrófono. Por favor, verifica los permisos.')
      return false
    }
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    setError('')
    
    const mediaInitialized = await initializeMedia()
    
    if (mediaInitialized) {
      // TODO: Implement WebRTC connection logic with backend
      // This would typically involve:
      // 1. Creating RTCPeerConnection
      // 2. Adding local stream tracks
      // 3. Creating and exchanging SDP offers/answers
      // 4. Handling ICE candidates
      
      setTimeout(() => {
        setIsConnected(true)
        setIsConnecting(false)
      }, 1500)
    } else {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    // TODO: Close WebRTC connection
    
    setIsConnected(false)
    router.back()
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Video className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-semibold text-foreground">Videoconsulta</h1>
              {participante && (
                <p className="text-sm text-muted-foreground">
                  {participante.tipo === 'medico' ? 'Dr.' : ''} {participante.nombre} {participante.apellido}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <Badge variant="outline" className="gap-2">
                <Clock className="h-4 w-4" />
                {formatDuration(duration)}
              </Badge>
            )}
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex flex-1 flex-col overflow-hidden p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid flex-1 gap-4 lg:grid-cols-3">
          {/* Remote Video (Main) */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="relative flex h-full items-center justify-center bg-muted p-0">
                {isConnected ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    {isConnecting ? (
                      <>
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="text-sm text-muted-foreground">Conectando...</p>
                      </>
                    ) : (
                      <>
                        <h2 className="font-sans text-xl font-semibold text-foreground">
                          {participante ? `${participante.nombre} ${participante.apellido}` : 'Esperando...'}
                        </h2>
                        <Button onClick={handleConnect} size="lg" className="gap-2">
                          <Video className="h-5 w-5" />
                          Iniciar Videollamada
                        </Button>
                      </>
                    )}
                  </div>
                )}
                
                {/* Local Video (PIP) */}
                {isConnected && (
                  <div className="absolute bottom-4 right-4 w-48 overflow-hidden rounded-lg border-2 border-background shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                    {isVideoOff && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <VideoOff className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel */}
          <div className="hidden lg:block">
            <Card className="h-full">
              <CardContent className="flex h-full flex-col p-4">
                <div className="mb-4 flex items-center justify-between border-b pb-3">
                  <h3 className="font-semibold text-foreground">Chat</h3>
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 overflow-y-auto">
                  <p className="text-center text-sm text-muted-foreground">
                    No hay mensajes aún
                  </p>
                </div>
                <div className="mt-4 border-t pt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      disabled={!isConnected}
                    />
                    <Button size="sm" disabled={!isConnected}>
                      Enviar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Controls */}
      {isConnected && (
        <footer className="border-t bg-card">
          <div className="container flex h-20 items-center justify-center gap-4">
            <Button
              size="lg"
              variant={isMuted ? 'destructive' : 'secondary'}
              className="h-14 w-14 rounded-full p-0"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>

            <Button
              size="lg"
              variant={isVideoOff ? 'destructive' : 'secondary'}
              className="h-14 w-14 rounded-full p-0"
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="h-14 w-14 rounded-full p-0 lg:hidden"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="h-14 w-14 rounded-full p-0"
            >
              <Monitor className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              variant="destructive"
              className="h-14 w-14 rounded-full p-0"
              onClick={handleDisconnect}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}
