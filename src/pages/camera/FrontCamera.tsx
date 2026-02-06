import { useEffect, useMemo, useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { Camera, CheckCircle2, AlertCircle, RefreshCw, Bell, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const attendanceHistory = [
    { name: 'Aditiya R.', id: 'WK-018', date: '2026-02-07', checkIn: '08:01', checkOut: '17:12', status: 'Tepat Waktu', similarity: '98.5%' },
    { name: 'Sarah Wilson', id: 'WK-021', date: '2026-02-07', checkIn: '08:23', checkOut: '17:09', status: 'Terlambat', similarity: '97.2%' },
    { name: 'Michael Chen', id: 'WK-011', date: '2026-02-07', checkIn: '08:05', checkOut: '17:00', status: 'Tepat Waktu', similarity: '98.1%' },
    { name: 'Emma Davis', id: 'WK-030', date: '2026-02-07', checkIn: '—', checkOut: '—', status: 'Tidak Hadir', similarity: '-' },
    { name: 'James Wilson', id: 'WK-015', date: '2026-02-06', checkIn: '08:02', checkOut: '17:20', status: 'Tepat Waktu', similarity: '99.0%' },
    { name: 'Livia S.', id: 'WK-042', date: '2026-02-06', checkIn: '08:19', checkOut: '17:08', status: 'Terlambat', similarity: '96.8%' },
];

const realtimeNotifications = [
    { title: 'Wajah terverifikasi', detail: 'Aditiya R. check-in tepat waktu', time: 'Baru saja' },
    { title: 'Deteksi terlambat', detail: 'Sarah Wilson check-in 08:23', time: '3 menit lalu' },
    { title: 'Check-out otomatis', detail: 'Michael Chen check-out 17:00', time: '15 menit lalu' },
    { title: 'Tidak hadir', detail: 'Emma Davis belum check-in', time: '40 menit lalu' },
];

export default function FrontCamera() {
    const constraints = useMemo<MediaStreamConstraints>(() => ({
        video: { facingMode: 'user' }
    }), []);
    const { videoRef, startCamera, stopCamera, captureImage, error, isActive } = useCamera(constraints);
    const [lastCapture, setLastCapture] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [sortKey, setSortKey] = useState('Terbaru');
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);

    const handleCapture = () => {
        const image = captureImage();
        if (image) {
            setLastCapture(image);
            setStatus('scanning');
            // Simulate API call
            setTimeout(() => {
                setStatus('success');
                setActionMessage('Absensi otomatis tercatat untuk Aditiya R.');
            }, 1500);
        }
    };

    const handleApplyFilters = () => {
        setIsHistoryLoading(true);
        setActionMessage('Filter absensi diterapkan.');
        setTimeout(() => setIsHistoryLoading(false), 400);
    };

    const summary = useMemo(() => {
        const total = attendanceHistory.length;
        const onTime = attendanceHistory.filter((item) => item.status === 'Tepat Waktu').length;
        const late = attendanceHistory.filter((item) => item.status === 'Terlambat').length;
        const absent = attendanceHistory.filter((item) => item.status === 'Tidak Hadir').length;
        return { total, onTime, late, absent };
    }, []);

    const filteredHistory = useMemo(() => {
        const byStatus = statusFilter === 'Semua'
            ? attendanceHistory
            : attendanceHistory.filter((item) => item.status === statusFilter);
        const bySearch = searchQuery.trim()
            ? byStatus.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : byStatus;
        const sorted = [...bySearch].sort((a, b) => {
            if (sortKey === 'Terbaru') return b.date.localeCompare(a.date);
            if (sortKey === 'Check-In') return (b.checkIn || '').localeCompare(a.checkIn || '');
            return a.name.localeCompare(b.name);
        });
        return sorted;
    }, [searchQuery, sortKey, statusFilter]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Face Attendance</h1>
                    <p className="text-gray-500">AI face scan untuk absensi tepat waktu, terlambat, dan tidak hadir</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    {isActive ? 'Camera Active' : 'Camera Offline'}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {actionMessage && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {actionMessage}
                </div>
            )}

            <div className="grid md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Absensi', value: summary.total, tone: 'text-slate-700', bg: 'bg-slate-50' },
                    { label: 'Tepat Waktu', value: summary.onTime, tone: 'text-emerald-700', bg: 'bg-emerald-50' },
                    { label: 'Terlambat', value: summary.late, tone: 'text-amber-700', bg: 'bg-amber-50' },
                    { label: 'Tidak Hadir', value: summary.absent, tone: 'text-rose-700', bg: 'bg-rose-50' },
                ].map((item) => (
                    <div key={item.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <p className={`text-2xl font-bold ${item.tone}`}>{item.value}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl ${item.bg}`} />
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="relative bg-black rounded-3xl overflow-hidden shadow-xl aspect-video relative group">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />

                    <div className="absolute inset-0 border-2 border-white/20 rounded-3xl m-8 pointer-events-none">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-xl border-white/50"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-xl border-white/50"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-xl border-white/50"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-xl border-white/50"></div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                        <button
                            onClick={handleCapture}
                            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-primary-600 hover:text-primary-700"
                        >
                            <Camera size={32} />
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Detection Status</h3>

                        {status === 'idle' && (
                            <div className="text-center py-8 text-gray-400">
                                <Camera size={48} className="mx-auto mb-3 opacity-50" />
                                <p>Ready to scan</p>
                            </div>
                        )}

                        {status === 'scanning' && (
                            <div className="text-center py-8">
                                <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-primary-600 font-medium">Verifying face...</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                                <CheckCircle2 size={48} className="mx-auto mb-2 text-green-500" />
                                <h4 className="font-bold text-gray-900 text-lg">Verified!</h4>
                                <p className="text-green-700">Similarity: 98.5%</p>
                                <p className="text-sm text-gray-500 mt-1">Verified as: Aditiya R.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Real-time Notifications</h3>
                            <button
                                onClick={() => setActionMessage('Semua notifikasi ditandai sebagai dibaca.')}
                                className="text-sm text-primary-600 hover:text-primary-700 transition"
                            >
                                Tandai semua
                            </button>
                        </div>
                        <div className="space-y-3">
                            {realtimeNotifications.map((item) => (
                                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-gray-100 p-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                        <Bell size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.detail}</p>
                                        <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {lastCapture && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-800">Last Capture</h3>
                                <button onClick={() => setLastCapture(null)} className="text-gray-400 hover:text-gray-600">
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                            <img src={lastCapture} alt="Capture" className="w-full rounded-xl border" />
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Riwayat Kehadiran</h2>
                        <p className="text-gray-500 text-sm">Data dummy dengan filter, sorting, dan pencarian.</p>
                    </div>
                    <button
                        onClick={() => setActionMessage('Laporan absensi berhasil diekspor.')}
                        className="px-4 py-2 rounded-lg border border-primary-100 text-primary-700 hover:bg-primary-50 transition"
                    >
                        Export Report
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
                            <option>Tepat Waktu</option>
                            <option>Terlambat</option>
                            <option>Tidak Hadir</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                        <ArrowUpDown size={16} className="text-gray-400" />
                        <select
                            value={sortKey}
                            onChange={(event) => setSortKey(event.target.value)}
                            className="w-full py-2 text-sm text-gray-600 focus:outline-none"
                        >
                            <option>Terbaru</option>
                            <option>Check-In</option>
                            <option>Nama</option>
                        </select>
                    </div>
                    <button
                        onClick={handleApplyFilters}
                        className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
                    >
                        Terapkan
                    </button>
                </div>

                {isHistoryLoading ? (
                    <div className="py-10 text-center text-sm text-gray-400">Memuat riwayat absensi...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 border-b">
                                    <th className="py-3 pr-4 font-medium">Nama</th>
                                    <th className="py-3 pr-4 font-medium">Tanggal</th>
                                    <th className="py-3 pr-4 font-medium">Check-in</th>
                                    <th className="py-3 pr-4 font-medium">Check-out</th>
                                    <th className="py-3 pr-4 font-medium">Status</th>
                                    <th className="py-3 font-medium">Similarity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHistory.map((item) => (
                                    <tr key={`${item.name}-${item.date}`} className="border-b last:border-b-0 text-gray-600">
                                        <td className="py-3 pr-4">
                                            <p className="font-semibold text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.id}</p>
                                        </td>
                                        <td className="py-3 pr-4">{item.date}</td>
                                        <td className="py-3 pr-4">{item.checkIn}</td>
                                        <td className="py-3 pr-4">{item.checkOut}</td>
                                        <td className="py-3 pr-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    item.status === 'Tepat Waktu'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : item.status === 'Terlambat'
                                                            ? 'bg-amber-50 text-amber-700'
                                                            : 'bg-rose-50 text-rose-700'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3">{item.similarity}</td>
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
