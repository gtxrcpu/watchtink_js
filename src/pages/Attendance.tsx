import { useState } from 'react';
import { Search, Filter, Download, MoreVertical, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { cn } from '../lib/utils'; // Ensure cn utility exists

const mockAttendance = [
    { id: 1, name: 'Aditiya R.', dept: 'Engineering', date: '2025-05-15', checkIn: '08:45 AM', checkOut: '05:15 PM', status: 'On Time', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
    { id: 2, name: 'Sarah Wilson', dept: 'Marketing', date: '2025-05-15', checkIn: '09:05 AM', checkOut: '06:00 PM', status: 'Late', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    { id: 3, name: 'Michael Chen', dept: 'Design', date: '2025-05-15', checkIn: '08:50 AM', checkOut: '05:30 PM', status: 'On Time', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { id: 4, name: 'Emma Davis', dept: 'HR', date: '2025-05-15', checkIn: '08:30 AM', checkOut: '05:00 PM', status: 'On Time', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 5, name: 'James Wilson', dept: 'Engineering', date: '2025-05-15', checkIn: '-', checkOut: '-', status: 'Absent', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
];

export default function Attendance() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredData = mockAttendance.filter(item =>
        (statusFilter === 'All' || item.status === statusFilter) &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.dept.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Attendance Log</h1>
                    <p className="text-gray-500">Manage employee daily attendance records</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                        <Download size={18} />
                        Export List
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Header Controls */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-50 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {['All', 'On Time', 'Late', 'Absent'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-3 py-1.5 text-sm rounded-lg transition-colors",
                                    statusFilter === status
                                        ? "bg-primary-50 text-primary-700 font-medium"
                                        : "text-gray-500 hover:bg-gray-50"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-500 text-sm font-medium">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Check In</th>
                                <th className="px-6 py-4">Check Out</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={item.photo} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">ID: #{item.id.toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{item.dept}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{item.date}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium text-sm">{item.checkIn}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium text-sm">{item.checkOut}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-xs font-medium border",
                                            item.status === 'On Time' && "bg-green-50 text-green-700 border-green-100",
                                            item.status === 'Late' && "bg-amber-50 text-amber-700 border-amber-100",
                                            item.status === 'Absent' && "bg-red-50 text-red-700 border-red-100",
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600 transition">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Showing 1-5 of 48 records</span>
                    <div className="flex items-center gap-2">
                        <button className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
                            <ChevronLeft size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 border rounded-lg hover:bg-gray-50">
                            <ChevronRight size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
