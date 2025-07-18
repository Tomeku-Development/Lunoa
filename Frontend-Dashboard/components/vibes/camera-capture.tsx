'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Camera, 
  Video, 
  Mic, 
  Square, 
  RotateCcw, 
  Check, 
  X, 
  MapPin,
  Upload,
  FileImage,
  FileVideo,
  FileAudio,
  Loader2,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface MediaCapture {
  type: 'photo' | 'video' | 'audio';
  data: string; // base64 or blob URL
  file?: File;
  thumbnail?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface CameraCaptureProps {
  onCapture?: (media: MediaCapture, metadata: VibeMetadata) => void;
  className?: string;
}

interface VibeMetadata {
  title: string;
  description: string;
  location?: LocationData;
  tags: string[];
}

export function CameraCapture({ onCapture, className = '' }: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<'photo' | 'video' | 'audio'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<MediaCapture | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [metadata, setMetadata] = useState<VibeMetadata>({
    title: '',
    description: '',
    tags: []
  });
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Get user location
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          // Reverse geocoding to get address (mock implementation)
          setLocation(prev => prev ? {
            ...prev,
            address: 'Current Location' // Replace with actual reverse geocoding
          } : null);
        },
        (error) => {
          console.warn('Location access denied:', error);
          toast.warning('Location access denied. You can add location manually.');
        }
      );
    }
  }, [isOpen]);

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: currentMode === 'photo' || currentMode === 'video',
        audio: currentMode === 'video' || currentMode === 'audio'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current && (currentMode === 'photo' || currentMode === 'video')) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      toast.error('Failed to access camera/microphone');
    }
  }, [currentMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedMedia(null);
      setIsRecording(false);
    }

    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedMedia({
          type: 'photo',
          data: url,
          file: new File([blob], 'photo.jpg', { type: 'image/jpeg' })
        });
      }
    }, 'image/jpeg', 0.8);
  }, []);

  const startVideoRecording = useCallback(async () => {
    if (!streamRef.current) return;

    try {
      chunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        // Create thumbnail
        const video = document.createElement('video');
        video.src = url;
        video.currentTime = 1;
        video.onloadeddata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.5);
            
            setCapturedMedia({
              type: 'video',
              data: url,
              file: new File([blob], 'video.webm', { type: 'video/webm' }),
              thumbnail
            });
          }
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting video recording:', error);
      toast.error('Failed to start video recording');
    }
  }, []);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const startAudioRecording = useCallback(async () => {
    if (!streamRef.current) return;

    try {
      chunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        setCapturedMedia({
          type: 'audio',
          data: url,
          file: new File([blob], 'audio.webm', { type: 'audio/webm' })
        });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast.error('Failed to start audio recording');
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('image/') ? 'photo' : 
                 file.type.startsWith('video/') ? 'video' : 'audio';

    setCapturedMedia({
      type: type as 'photo' | 'video' | 'audio',
      data: url,
      file
    });
  };

  const retake = () => {
    setCapturedMedia(null);
    if (currentMode !== 'audio') {
      startCamera();
    }
  };

  const handlePublish = async () => {
    if (!capturedMedia || !metadata.title.trim()) {
      toast.error('Please add a title for your vibe');
      return;
    }

    setIsUploading(true);
    
    try {
      // Mock upload - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const vibeMetadata: VibeMetadata = {
        ...metadata,
        location: location || undefined
      };

      onCapture?.(capturedMedia, vibeMetadata);
      toast.success('Vibe published successfully!');
      setIsOpen(false);
      
      // Reset form
      setCapturedMedia(null);
      setMetadata({ title: '', description: '', tags: [] });
    } catch (error) {
      console.error('Error publishing vibe:', error);
      toast.error('Failed to publish vibe');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`flex items-center gap-2 ${className}`}>
          <Camera className="h-4 w-4" />
          Create Vibe
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Vibe</DialogTitle>
          <DialogDescription>
            Capture a moment and share it with the Lunoa community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button 
              variant={currentMode === 'photo' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentMode('photo')}
              disabled={isRecording}
            >
              <Camera className="h-4 w-4 mr-1" />
              Photo
            </Button>
            <Button 
              variant={currentMode === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentMode('video')}
              disabled={isRecording}
            >
              <Video className="h-4 w-4 mr-1" />
              Video
            </Button>
            <Button 
              variant={currentMode === 'audio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentMode('audio')}
              disabled={isRecording}
            >
              <Mic className="h-4 w-4 mr-1" />
              Audio
            </Button>
            
            <div className="ml-auto">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Camera/Preview Area */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                {!capturedMedia && (currentMode === 'photo' || currentMode === 'video') && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}

                {!capturedMedia && currentMode === 'audio' && (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Mic className="h-16 w-16 mx-auto mb-4" />
                      <p>Audio Recording Mode</p>
                      {isRecording && (
                        <div className="mt-4">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mx-auto"></div>
                          <p className="text-sm mt-2">Recording...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {capturedMedia && (
                  <div className="w-full h-full">
                    {capturedMedia.type === 'photo' && (
                      <img src={capturedMedia.data} alt="Captured" className="w-full h-full object-cover" />
                    )}
                    {capturedMedia.type === 'video' && (
                      <video src={capturedMedia.data} controls className="w-full h-full object-cover" />
                    )}
                    {capturedMedia.type === 'audio' && (
                      <div className="flex items-center justify-center h-full text-white">
                        <div className="text-center">
                          <FileAudio className="h-16 w-16 mx-auto mb-4" />
                          <audio src={capturedMedia.data} controls className="mt-4" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Capture Controls */}
                {!capturedMedia && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-4">
                      {currentMode === 'photo' && (
                        <Button onClick={capturePhoto} size="lg" className="rounded-full">
                          <Camera className="h-6 w-6" />
                        </Button>
                      )}
                      {currentMode === 'video' && !isRecording && (
                        <Button onClick={startVideoRecording} size="lg" className="rounded-full">
                          <Video className="h-6 w-6" />
                        </Button>
                      )}
                      {currentMode === 'video' && isRecording && (
                        <Button onClick={stopVideoRecording} size="lg" className="rounded-full bg-red-500 hover:bg-red-600">
                          <Square className="h-6 w-6" />
                        </Button>
                      )}
                      {currentMode === 'audio' && !isRecording && (
                        <Button onClick={startAudioRecording} size="lg" className="rounded-full">
                          <Mic className="h-6 w-6" />
                        </Button>
                      )}
                      {currentMode === 'audio' && isRecording && (
                        <Button onClick={stopVideoRecording} size="lg" className="rounded-full bg-red-500 hover:bg-red-600">
                          <Square className="h-6 w-6" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadata Form */}
          {capturedMedia && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Give your vibe a catchy title..."
                  value={metadata.title}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your vibe..."
                  value={metadata.description}
                  onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  placeholder="Add tags separated by commas..."
                  onChange={(e) => setMetadata(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  }))}
                />
              </div>

              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {capturedMedia ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={retake} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-1" />
                Retake
              </Button>
              <Button 
                onClick={handlePublish} 
                disabled={!metadata.title.trim() || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-1" />
                    Publish Vibe
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
