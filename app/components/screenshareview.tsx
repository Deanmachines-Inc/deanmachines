import { useState, useRef, useEffect } from 'react';
import { genkitClient } from '~/lib/genkit/client';

interface ScreenShareViewProps {
  onError: (error: Error) => void;
}

export default function ScreenShareView({ onError }: ScreenShareViewProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleError = (error: Error) => {
      onError(error);
    };

    const startCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false,
        });
        setStream(stream);
      } catch (error: any) {
        handleError(error);
      }
    };

    startCapture();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}
