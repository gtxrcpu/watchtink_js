import { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Heart, Activity, Moon, Footprints, Download, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';


const healthData = [
    { time: '06:00', heartRate: 72, steps: 120 },
    { time: '09:00', heartRate: 85, steps: 1200 },
    { time: '12:00', heartRate: 90, steps: 3500 },
    { time: '15:00', heartRate: 88, steps: 5100 },
    { time: '18:00', heartRate: 95, steps: 7200 },
    { time: '21:00', heartRate: 78, steps: 8500 },
];

const fitnessData = [
    { day: 'Mon', steps: 6500 },
    { day: 'Tue', steps: 8200 },
    { day: 'Wed', steps: 10500 },
    { day: 'Thu', steps: 7800 },
    { day: 'Fri', steps: 9200 },
    { day: 'Sat', steps: 12500 },
    { day: 'Sun', steps: 5500 },
];

const physicalRoster = [
    { name: 'Aditiya R.', role: 'Engineer', heartRate: 78, spo2: 98, temperature: 36.6, steps: 8450, status: 'Normal' },
    { name: 'Sarah Wilson', role: 'Marketing', heartRate: 92, spo2: 96, temperature: 37.4, steps: 5320, status: 'Perlu Perhatian' },
    { name: 'Michael Chen', role: 'Design', heartRate: 81, spo2: 97, temperature: 36.8, steps: 9120, status: 'Normal' },
    { name: 'Emma Davis', role: 'HR', heartRate: 95, spo2: 95, temperature: 37.6, steps: 4210, status: 'Perlu Perhatian' },
    { name: 'James Wilson', role: 'Engineering', heartRate: 76, spo2: 98, temperature: 36.5, steps: 10320, status: 'Normal' },
    { name: 'Livia S.', role: 'Finance', heartRate: 88, spo2: 97, temperature: 37.0, steps: 6750, status: 'Normal' },
];

export default function PhysicalHealth() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [sortKey, setSortKey] = useState('Langkah Tertinggi');
    const [isLoading, setIsLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const filteredRoster = useMemo(() => {
        const byStatus = statusFilter === 'Semua'
            ? physicalRoster
            : physicalRoster.filter((item) => item.status === statusFilter);
        const byQuery = searchQuery.trim()
            ? byStatus.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : byStatus;
        const sorted = [...byQuery].sort((a, b) => {
            if (sortKey === 'Langkah Tertinggi') return b.steps - a.steps;
            if (sortKey === 'Detak Tertinggi') return b.heartRate - a.heartRate;
            return a.name.localeCompare(b.name);
        });
        return sorted;
    }, [searchQuery, sortKey, statusFilter]);

    const handleApplyFilters = () => {
        setIsLoading(true);
        setActionMessage('Filter kesehatan fisik diterapkan.');
        setTimeout(() => setIsLoading(false), 400);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Physical Health Monitor</h1>
                    <p className="text-gray-500">Analisis kondisi fisik dan data vital karyawan berbasis dummy</p>
                </div>
                <button
                    onClick={() => setActionMessage('Laporan kesehatan fisik berhasil diekspor.')}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {actionMessage && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {actionMessage}
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Heart, label: 'Heart Rate', value: '78 BPM', sub: 'Rentang normal 60-100', color: 'text-rose-600', bg: 'bg-rose-50' },
                    { icon: Activity, label: 'Kebugaran', value: '82%', sub: 'Stamina stabil', color: 'text-orange-600', bg: 'bg-orange-50' },
                    { icon: Footprints, label: 'Steps Today', value: '8,502', sub: 'Target harian 10,000', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { icon: Moon, label: 'Sleep Quality', value: '7h 20m', sub: 'Rata-rata minggu ini', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map((card, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`p-3 rounded-full ${card.bg} ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <h3 className="text-xl font-bold text-gray-900">{card.value}</h3>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 pl-1">{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-6">Heart Rate (Today)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={healthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Line type="monotone" dataKey="heartRate" stroke="#e11d48" strokeWidth={3} dot={{ stroke: '#e11d48', strokeWidth: 2, r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-6">Steps Activity (Weekly)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fitnessData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="steps" fill="#059669" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Ringkasan Data Vital Karyawan</h2>
                        <p className="text-gray-500 text-sm">Pakai filter, sorting, dan search untuk navigasi data dummy.</p>
                    </div>
                    <button
                        onClick={handleApplyFilters}
                        className="px-4 py-2 rounded-lg border border-primary-100 text-primary-700 hover:bg-primary-50 transition"
                    >
                        Terapkan Filter
                    </button>
                </div>
                <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Cari nama karyawan"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50"
                        />
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                        <SlidersHorizontal size={16} className="text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full py-2 text-sm text-gray-600 focus:outline-none"
                        >
                            <option>Semua</option>
                            <option>Normal</option>
                            <option>Perlu Perhatian</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                        <ArrowUpDown size={16} className="text-gray-400" />
                        <select
                            value={sortKey}
                            onChange={(event) => setSortKey(event.target.value)}
                            className="w-full py-2 text-sm text-gray-600 focus:outline-none"
                        >
                            <option>Langkah Tertinggi</option>
                            <option>Detak Tertinggi</option>
                            <option>Nama</option>
                        </select>
                    </div>
                    <div className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500 flex items-center justify-between">
                        <span>Total</span>
                        <span className="font-semibold text-gray-800">{filteredRoster.length}</span>
                    </div>
                </div>
                {isLoading ? (
                    <div className="py-10 text-center text-sm text-gray-400">Memuat data vital...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 border-b">
                                    <th className="py-3 pr-4 font-medium">Nama</th>
                                    <th className="py-3 pr-4 font-medium">Heart Rate</th>
                                    <th className="py-3 pr-4 font-medium">SpO2</th>
                                    <th className="py-3 pr-4 font-medium">Suhu</th>
                                    <th className="py-3 pr-4 font-medium">Steps</th>
                                    <th className="py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRoster.map((item) => (
                                    <tr key={item.name} className="border-b last:border-b-0 text-gray-600">
                                        <td className="py-3 pr-4">
                                            <p className="font-semibold text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.role}</p>
                                        </td>
                                        <td className="py-3 pr-4">{item.heartRate} bpm</td>
                                        <td className="py-3 pr-4">{item.spo2}%</td>
                                        <td className="py-3 pr-4">{item.temperature.toFixed(1)}°C</td>
                                        <td className="py-3 pr-4">{item.steps.toLocaleString('id-ID')}</td>
                                        <td className="py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    item.status === 'Normal'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
