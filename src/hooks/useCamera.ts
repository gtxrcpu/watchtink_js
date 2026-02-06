import { useState, useEffect, useRef, useCallback } from 'react';

export function useCamera(constraints: MediaStreamConstraints = { video: true }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(false);

    const startCamera = useCallback(async () => {
        if (streamRef.current) {
            if (videoRef.current && videoRef.current.srcObject !== streamRef.current) {
                videoRef.current.srcObject = streamRef.current;
            }
            setIsActive(true);
            return;
        }
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = mediaStream;
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsActive(true);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to access camera');
            setIsActive(false);
        }
    }, [constraints]);

    const stopCamera = useCallback(() => {
        const activeStream = streamRef.current;
        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
        }
        streamRef.current = null;
        setStream(null);
        setIsActive(false);
    }, []);

    const captureImage = useCallback(() => {
        if (!videoRef.current) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            return canvas.toDataURL('image/jpeg');
        }
        return null;
    }, []);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return { videoRef, startCamera, stopCamera, captureImage, error, isActive, stream };
}
