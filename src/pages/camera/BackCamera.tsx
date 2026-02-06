import { useEffect, useMemo, useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { Camera, RefreshCw, FlipHorizontal, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackCamera() {
    const constraints = useMemo<MediaStreamConstraints>(() => ({
        video: { facingMode: 'environment' }
    }), []);
    const { videoRef, startCamera, stopCamera, captureImage, isActive } = useCamera(constraints);
    const [lastCapture, setLastCapture] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const handleCapture = () => {
        const image = captureImage();
        if (image) {
            setLastCapture(image);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/camera/front')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Back Camera</h1>
                        <p className="text-gray-500">Use for environment capture or alternative view</p>
                    </div>
                </div>

                <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    {isActive ? 'Active' : 'Offline'}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="relative bg-black rounded-3xl overflow-hidden shadow-xl aspect-video group">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover" // No mirror scale for back camera
                    />

                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-auto">
                        <button
                            onClick={() => navigate('/camera/front')}
                            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
                            title="Switch to Front Camera"
                        >
                            <FlipHorizontal size={24} />
                        </button>

                        <button
                            onClick={handleCapture}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-200 hover:scale-105 active:scale-95 transition-all"
                        >
                            <div className="w-16 h-16 bg-white border-2 border-primary-500 rounded-full"></div>
                        </button>

                        <div className="w-12"></div> {/* Spacer for symmetry */}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
                        {!lastCapture ? (
                            <>
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Camera size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No Image Captured</h3>
                                <p className="text-gray-500 max-w-xs mt-2">Take a photo using the capture button to see the result here.</p>
                            </>
                        ) : (
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-800">Result</h3>
                                    <button onClick={() => setLastCapture(null)} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                                        <RefreshCw size={14} />
                                        Retake
                                    </button>
                                </div>
                                <img src={lastCapture} alt="Capture" className="w-full rounded-xl border shadow-sm" />
                                <div className="mt-4 flex gap-3">
                                    <button className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 transition">
                                        Use Photo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
