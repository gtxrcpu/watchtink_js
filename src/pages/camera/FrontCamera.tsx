import { useEffect, useMemo, useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { AlertCircle, RefreshCw, Bell, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
    const resolutionOptions = [
        { label: '480p', width: 640, height: 480 },
        { label: '720p', width: 1280, height: 720 },
        { label: '1080p', width: 1920, height: 1080 }
    ];
    const [frontResolution, setFrontResolution] = useState(resolutionOptions[1]);
    const [backResolution, setBackResolution] = useState(resolutionOptions[1]);
    const [syncCapture, setSyncCapture] = useState(true);
    const frontConstraints = useMemo<MediaStreamConstraints>(() => ({
        video: { facingMode: 'user', width: { ideal: frontResolution.width }, height: { ideal: frontResolution.height } }
    }), [frontResolution]);
    const backConstraints = useMemo<MediaStreamConstraints>(() => ({
        video: { facingMode: 'environment', width: { ideal: backResolution.width }, height: { ideal: backResolution.height } }
    }), [backResolution]);
    const {
        videoRef: frontVideoRef,
        startCamera: startFrontCamera,
        stopCamera: stopFrontCamera,
        captureImage: captureFrontImage,
        error: frontError,
        isActive: frontIsActive
    } = useCamera(frontConstraints);
    const {
        videoRef: backVideoRef,
        startCamera: startBackCamera,
        stopCamera: stopBackCamera,
        captureImage: captureBackImage,
        error: backError,
        isActive: backIsActive
    } = useCamera(backConstraints);
    const [frontCapture, setFrontCapture] = useState<string | null>(null);
    const [backCapture, setBackCapture] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [sortKey, setSortKey] = useState('Terbaru');
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    useEffect(() => {
        stopFrontCamera();
        startFrontCamera();
    }, [startFrontCamera, stopFrontCamera, frontResolution]);

    useEffect(() => {
        stopBackCamera();
        startBackCamera();
    }, [startBackCamera, stopBackCamera, backResolution]);

    const handleCaptureFront = () => {
        const image = captureFrontImage();
        if (image) {
            setFrontCapture(image);
            setActionMessage('Capture kamera depan tersimpan.');
        }
        if (syncCapture) {
            const backImage = captureBackImage();
            if (backImage) {
                setBackCapture(backImage);
            }
        }
    };

    const handleCaptureBack = () => {
        const image = captureBackImage();
        if (image) {
            setBackCapture(image);
            setActionMessage('Capture kamera belakang tersimpan.');
        }
        if (syncCapture) {
            const frontImage = captureFrontImage();
            if (frontImage) {
                setFrontCapture(frontImage);
            }
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
                <button
                    onClick={() => setSyncCapture((prev) => !prev)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${syncCapture ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    title="Sync Capture"
                >
                    {syncCapture ? 'Sync Capture: On' : 'Sync Capture: Off'}
                </button>
            </div>

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

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Front Camera</h3>
                            <p className="text-xs text-gray-500">Facing user</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${frontIsActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {frontIsActive ? 'Active' : 'Offline'}
                        </div>
                    </div>

                    {frontError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle size={18} />
                            {frontError}
                            <button onClick={startFrontCamera} className="ml-auto px-3 py-1 rounded-md bg-red-600 text-white text-xs">Retry</button>
                        </div>
                    )}

                    <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                        <video
                            ref={frontVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
                            FRONT
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Resolution</span>
                            <select
                                value={frontResolution.label}
                                onChange={(event) => {
                                    const next = resolutionOptions.find(option => option.label === event.target.value);
                                    if (next) setFrontResolution(next);
                                }}
                                className="px-3 py-2 rounded-xl border border-gray-200 text-sm"
                            >
                                {resolutionOptions.map(option => (
                                    <option key={option.label} value={option.label}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleCaptureFront}
                            className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition"
                        >
                            Capture Front
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3 border border-dashed border-gray-200">
                        {frontCapture ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Preview</span>
                                    <button onClick={() => setFrontCapture(null)} className="text-gray-400 hover:text-gray-600">
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                                <img src={frontCapture} alt="Front capture" className="w-full rounded-xl border" />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-6">Belum ada preview kamera depan.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Back Camera</h3>
                            <p className="text-xs text-gray-500">Facing environment</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${backIsActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {backIsActive ? 'Active' : 'Offline'}
                        </div>
                    </div>

                    {backError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle size={18} />
                            {backError}
                            <button onClick={startBackCamera} className="ml-auto px-3 py-1 rounded-md bg-red-600 text-white text-xs">Retry</button>
                        </div>
                    )}

                    <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                        <video
                            ref={backVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
                            BACK
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Resolution</span>
                            <select
                                value={backResolution.label}
                                onChange={(event) => {
                                    const next = resolutionOptions.find(option => option.label === event.target.value);
                                    if (next) setBackResolution(next);
                                }}
                                className="px-3 py-2 rounded-xl border border-gray-200 text-sm"
                            >
                                {resolutionOptions.map(option => (
                                    <option key={option.label} value={option.label}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleCaptureBack}
                            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
                        >
                            Capture Back
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3 border border-dashed border-gray-200">
                        {backCapture ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Preview</span>
                                    <button onClick={() => setBackCapture(null)} className="text-gray-400 hover:text-gray-600">
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                                <img src={backCapture} alt="Back capture" className="w-full rounded-xl border" />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-6">Belum ada preview kamera belakang.</p>
                        )}
                    </div>
                </div>
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
