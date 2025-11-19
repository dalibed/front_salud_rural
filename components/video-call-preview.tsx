'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Video, Mic, Settings, AlertCircle, CheckCircle2 } from 'lucide-react'

interface VideoCallPreviewProps {
  onReady?: () => void
}

export function VideoCallPreview({ onReady }: VideoCallPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPermissions, setHasPermissions] = useState(false)
  const [permissionError, setPermissionError] = useState('')
  const [devices, setDevices] = useState({
    cameras: [] as MediaDeviceInfo[],
    microphones: [] as MediaDeviceInfo[],
  })

  useEffect(() => {
    checkPermissions()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const checkPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setStream(mediaStream)
      setHasPermissions(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      // Get available devices
      const deviceList = await navigator.mediaDevices.enumerateDevices()
      setDevices({
        cameras: deviceList.filter(d => d.kind === 'videoinput'),
        microphones: deviceList.filter(d => d.kind === 'audioinput'),
      })

      onReady?.()
    } catch (error) {
      console.log('[v0] Error accessing media devices:', error)
      setPermissionError(
        'No se pudo acceder a la cámara o micrófono. Por favor, verifica los permisos en tu navegador.'
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Vista Previa de Video
        </CardTitle>
        <CardDescription>
          Verifica que tu cámara y micrófono funcionen correctamente antes de unirte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permissionError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{permissionError}</AlertDescription>
          </Alert>
        ) : hasPermissions ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Cámara y micrófono configurados correctamente
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Solicitando permisos de cámara y micrófono...
            </AlertDescription>
          </Alert>
        )}

        <div className="aspect-video overflow-hidden rounded-lg bg-muted">
          {hasPermissions ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Esperando permisos...
                </p>
              </div>
            </div>
          )}
        </div>

        {hasPermissions && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Cámara</p>
                <p className="text-xs text-muted-foreground">
                  {devices.cameras.length} dispositivo(s) disponible(s)
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Mic className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Micrófono</p>
                <p className="text-xs text-muted-foreground">
                  {devices.microphones.length} dispositivo(s) disponible(s)
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
