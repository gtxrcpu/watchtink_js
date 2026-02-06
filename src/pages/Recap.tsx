
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { UserCheck, UserX, Clock, CalendarDays, Download } from 'lucide-react';

const pieData = [
    { name: 'Present', value: 85, color: '#10b981' },
    { name: 'Late', value: 10, color: '#f59e0b' },
    { name: 'Absent', value: 5, color: '#ef4444' },
];

const weeklyData = [
    { day: 'Mon', present: 45, late: 3, absent: 2 },
    { day: 'Tue', present: 48, late: 1, absent: 1 },
    { day: 'Wed', present: 46, late: 2, absent: 2 },
    { day: 'Thu', present: 47, late: 2, absent: 1 },
    { day: 'Fri', present: 44, late: 4, absent: 2 },
];

export default function Recap() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Attendance Recap</h1>
                    <p className="text-gray-500">Monthly attendance summary and reports</p>
                </div>
                <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Present', value: '1,245', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Total Late', value: '48', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Total Absent', value: '12', icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Work Days', value: '22', icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-6">Attendance Distribution</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-6">Weekly Trends</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Legend />
                                <Bar dataKey="present" name="Present" fill="#10b981" radius={[0, 0, 4, 4]} stackId="a" />
                                <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[0, 0, 4, 4]} stackId="a" />
                                <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
