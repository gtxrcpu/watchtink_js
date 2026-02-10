
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Brain, HeartPulse, ClipboardList, BarChart3, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar() {
    const userRole = useMemo(() => {
        if (typeof window === 'undefined') return 'admin';
        return localStorage.getItem('role') || 'admin';
    }, []);
    const canViewRecap = userRole === 'admin' || userRole === 'atasan';
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Camera, label: 'Face Scan', path: '/camera/front' },
        { icon: Brain, label: 'Mental Health', path: '/mental-health' },
        { icon: HeartPulse, label: 'Physical Health', path: '/physical-health' },
        { icon: ClipboardList, label: 'Attendance', path: '/attendance' },
        ...(canViewRecap ? [{ icon: BarChart3, label: 'Rekapitulasi Absensi', path: '/recap' }] : []),
    ];

    return (
        <aside className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 z-10 hidden md:flex">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                    WT
                </div>
                <span className="font-bold text-xl text-gray-800">WatchTink</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary-50 text-primary-600 font-medium"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )
                        }
                    >
                        <item.icon size={20} strokeWidth={1.5} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
