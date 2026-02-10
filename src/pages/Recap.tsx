
import { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Search, CalendarDays, Users, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const statusOptions = ['Semua', 'Hadir', 'Izin', 'Sakit', 'Alpha'];
const departments = ['Semua', 'Teknik', 'Keuangan', 'Marketing', 'HR', 'Kelas 10A', 'Kelas 11B'];

const names = [
    { name: 'Aditiya R.', dept: 'Teknik' },
    { name: 'Sarah Wilson', dept: 'Marketing' },
    { name: 'Michael Chen', dept: 'Keuangan' },
    { name: 'Emma Davis', dept: 'HR' },
    { name: 'Livia S.', dept: 'Kelas 10A' },
    { name: 'James Wilson', dept: 'Kelas 11B' },
    { name: 'Dimas Putra', dept: 'Teknik' },
    { name: 'Alya Safitri', dept: 'Kelas 10A' },
    { name: 'Raka Nugraha', dept: 'Kelas 11B' },
    { name: 'Rani Amelia', dept: 'Marketing' },
];

const statusPool = ['Hadir', 'Izin', 'Sakit', 'Alpha'] as const;

const pad = (value: number) => value.toString().padStart(2, '0');
const buildDate = (day: number) => `2026-02-${pad(day)}`;

const attendanceData = Array.from({ length: 42 }, (_, index) => {
    const person = names[index % names.length];
    const status = statusPool[index % statusPool.length];
    const day = 1 + (index % 20);
    const checkIn = status === 'Alpha' ? '—' : `0${8 + (index % 2)}:${pad(5 + (index % 40))}`;
    const checkOut = status === 'Alpha' ? '—' : `1${6 + (index % 2)}:${pad(5 + (index % 40))}`;
    return {
        id: index + 1,
        name: person.name,
        dept: person.dept,
        date: buildDate(day),
        checkIn,
        checkOut,
        status,
    };
});

export default function Recap() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [deptFilter, setDeptFilter] = useState('Semua');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [viewMode, setViewMode] = useState<'Mingguan' | 'Bulanan'>('Mingguan');
    const [actionMessage, setActionMessage] = useState<string | null>(null);


    const filteredData = useMemo(() => {
        const bySearch = search.trim()
            ? attendanceData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
            : attendanceData;
        const byStatus = statusFilter === 'Semua'
            ? bySearch
            : bySearch.filter((item) => item.status === statusFilter);
        const byDept = deptFilter === 'Semua'
            ? byStatus
            : byStatus.filter((item) => item.dept === deptFilter);
        const byDate = byDept.filter((item) => {
            if (!startDate && !endDate) return true;
            const dateValue = item.date;
            if (startDate && dateValue < startDate) return false;
            if (endDate && dateValue > endDate) return false;
            return true;
        });
        return byDate;
    }, [search, statusFilter, deptFilter, startDate, endDate]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));
    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * perPage;
        return filteredData.slice(startIndex, startIndex + perPage);
    }, [filteredData, page, perPage]);

    const summary = useMemo(() => {
        const count = (status: string) => filteredData.filter((item) => item.status === status).length;
        return {
            total: filteredData.length,
            hadir: count('Hadir'),
            izin: count('Izin'),
            sakit: count('Sakit'),
            alpha: count('Alpha'),
        };
    }, [filteredData]);

    const chartData = useMemo(() => {
        if (viewMode === 'Bulanan') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
            return months.map((label, idx) => {
                const monthIndex = idx;
                const items = filteredData.filter((item) => new Date(item.date).getMonth() === monthIndex);
                return {
                    label,
                    hadir: items.filter((item) => item.status === 'Hadir').length,
                    izin: items.filter((item) => item.status === 'Izin').length,
                    sakit: items.filter((item) => item.status === 'Sakit').length,
                    alpha: items.filter((item) => item.status === 'Alpha').length,
                };
            });
        }
        const buckets = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
        return buckets.map((label, idx) => {
            const items = filteredData.filter((item) => {
                const day = new Date(item.date).getDate();
                const weekIndex = Math.min(3, Math.floor((day - 1) / 7));
                return weekIndex === idx;
            });
            return {
                label,
                hadir: items.filter((item) => item.status === 'Hadir').length,
                izin: items.filter((item) => item.status === 'Izin').length,
                sakit: items.filter((item) => item.status === 'Sakit').length,
                alpha: items.filter((item) => item.status === 'Alpha').length,
            };
        });
    }, [filteredData, viewMode]);

    const pieData = useMemo(() => ([
        { name: 'Hadir', value: summary.hadir, color: '#10b981' },
        { name: 'Izin', value: summary.izin, color: '#f59e0b' },
        { name: 'Sakit', value: summary.sakit, color: '#3b82f6' },
        { name: 'Alpha', value: summary.alpha, color: '#ef4444' },
    ]), [summary]);

    const exportExcel = () => {
        const headers = ['Nama', 'Departemen/Kelas', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status'];
        const rows = filteredData.map((item) => [
            item.name,
            item.dept,
            item.date,
            item.checkIn,
            item.checkOut,
            item.status,
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'rekapitulasi-absensi.csv';
        link.click();
        URL.revokeObjectURL(link.href);
        setActionMessage('File Excel (CSV) berhasil dibuat.');
    };

    const exportPdf = () => {
        const popup = window.open('', '_blank');
        if (!popup) {
            setActionMessage('Gagal membuka jendela PDF. Periksa pengaturan popup browser.');
            return;
        }
        const rows = filteredData.map((item) => `
            <tr>
                <td>${item.name}</td>
                <td>${item.dept}</td>
                <td>${item.date}</td>
                <td>${item.checkIn}</td>
                <td>${item.checkOut}</td>
                <td>${item.status}</td>
            </tr>
        `).join('');
        popup.document.write(`
            <html>
                <head>
                    <title>Rekapitulasi Absensi</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { font-size: 20px; margin-bottom: 8px; }
                        table { width: 100%; border-collapse: collapse; font-size: 12px; }
                        th, td { border: 1px solid #e5e7eb; padding: 6px; text-align: left; }
                        th { background: #f9fafb; }
                    </style>
                </head>
                <body>
                    <h1>Rekapitulasi Absensi</h1>
                    <p>Rentang tanggal: ${startDate || '-'} hingga ${endDate || '-'}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Departemen/Kelas</th>
                                <th>Tanggal</th>
                                <th>Jam Masuk</th>
                                <th>Jam Pulang</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        popup.document.close();
        popup.focus();
        popup.print();
        setActionMessage('Siapkan cetak untuk PDF.');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Rekapitulasi Absensi</h1>
                    <p className="text-gray-500">Ringkasan kehadiran karyawan atau siswa dengan filter lengkap</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={exportExcel}
                        className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                        <Download size={18} />
                        Export Excel
                    </button>
                    <button
                        onClick={exportPdf}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        <Download size={18} />
                        Export PDF
                    </button>
                </div>
            </div>

            {actionMessage && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {actionMessage}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: 'Total Data', value: summary.total, icon: Users, tone: 'text-slate-700', bg: 'bg-slate-50' },
                    { label: 'Hadir', value: summary.hadir, icon: CheckCircle2, tone: 'text-emerald-700', bg: 'bg-emerald-50' },
                    { label: 'Izin + Sakit', value: summary.izin + summary.sakit, icon: CalendarDays, tone: 'text-blue-700', bg: 'bg-blue-50' },
                    { label: 'Alpha', value: summary.alpha, icon: XCircle, tone: 'text-rose-700', bg: 'bg-rose-50' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div>
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className={`text-2xl font-bold ${item.tone}`}>{item.value}</p>
                        </div>
                        <div className={`rounded-xl p-3 ${item.bg} ${item.tone}`}>
                            <item.icon size={22} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Cari nama karyawan/siswa"
                                className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-50 lg:w-72"
                            />
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={deptFilter}
                                onChange={(event) => {
                                    setDeptFilter(event.target.value);
                                    setPage(1);
                                }}
                                className="bg-transparent py-2 text-sm text-gray-600 focus:outline-none"
                            >
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                            <select
                                value={statusFilter}
                                onChange={(event) => {
                                    setStatusFilter(event.target.value);
                                    setPage(1);
                                }}
                                className="bg-transparent py-2 text-sm text-gray-600 focus:outline-none"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                            <CalendarDays size={16} className="text-gray-400" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(event) => {
                                    setStartDate(event.target.value);
                                    setPage(1);
                                }}
                                className="bg-transparent py-2 text-sm text-gray-600 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                            <CalendarDays size={16} className="text-gray-400" />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(event) => {
                                    setEndDate(event.target.value);
                                    setPage(1);
                                }}
                                className="bg-transparent py-2 text-sm text-gray-600 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Distribusi Kehadiran</h3>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={105}
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
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Ringkasan {viewMode}</h3>
                        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 text-xs font-semibold text-gray-600">
                            {['Mingguan', 'Bulanan'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode as 'Mingguan' | 'Bulanan')}
                                    className={cn(
                                        'rounded-full px-3 py-1',
                                        viewMode === mode ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'
                                    )}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Legend />
                                <Bar dataKey="hadir" name="Hadir" fill="#10b981" radius={[0, 0, 4, 4]} stackId="a" />
                                <Bar dataKey="izin" name="Izin" fill="#f59e0b" radius={[0, 0, 4, 4]} stackId="a" />
                                <Bar dataKey="sakit" name="Sakit" fill="#3b82f6" radius={[0, 0, 4, 4]} stackId="a" />
                                <Bar dataKey="alpha" name="Alpha" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-800">Tabel Rekapitulasi</h3>
                        <p className="text-sm text-gray-500">Menampilkan {filteredData.length} data sesuai filter</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(event) => {
                                setPerPage(Number(event.target.value));
                                setPage(1);
                            }}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
                        >
                            {[10, 20, 50].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b text-gray-500">
                                <th className="py-3 pr-4 font-medium">Nama</th>
                                <th className="py-3 pr-4 font-medium">Departemen/Kelas</th>
                                <th className="py-3 pr-4 font-medium">Tanggal</th>
                                <th className="py-3 pr-4 font-medium">Jam Masuk</th>
                                <th className="py-3 pr-4 font-medium">Jam Pulang</th>
                                <th className="py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item) => (
                                <tr key={`${item.id}-${item.date}`} className="border-b last:border-b-0 text-gray-600">
                                    <td className="py-3 pr-4">
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                    </td>
                                    <td className="py-3 pr-4">{item.dept}</td>
                                    <td className="py-3 pr-4">{item.date}</td>
                                    <td className="py-3 pr-4">{item.checkIn}</td>
                                    <td className="py-3 pr-4">{item.checkOut}</td>
                                    <td className="py-3">
                                        <span className={cn(
                                            'rounded-full border px-3 py-1 text-xs font-semibold',
                                            item.status === 'Hadir' && 'border-emerald-100 bg-emerald-50 text-emerald-700',
                                            item.status === 'Izin' && 'border-amber-100 bg-amber-50 text-amber-700',
                                            item.status === 'Sakit' && 'border-blue-100 bg-blue-50 text-blue-700',
                                            item.status === 'Alpha' && 'border-rose-100 bg-rose-50 text-rose-700',
                                        )}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-gray-500">
                        Menampilkan {(page - 1) * perPage + 1} - {Math.min(page * perPage, filteredData.length)} dari {filteredData.length} data
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-50"
                        >
                            Sebelumnya
                        </button>
                        <button
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-50"
                        >
                            Berikutnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
