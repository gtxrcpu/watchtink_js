
import { Bell, Search } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 w-64 bg-gray-50"
                    />
                </div>

                <button className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
}
