
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center text-primary-600">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading...</p>
        </div>
    );
}
