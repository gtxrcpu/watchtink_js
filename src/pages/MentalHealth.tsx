import { useEffect, useMemo, useState } from 'react';
import {
    Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import {
    Activity, AlertTriangle, ArrowUpDown, CheckCircle2, Download, FileText, Filter, Moon, Search, ShieldAlert, Sun, Users, RefreshCw
} from 'lucide-react';

const initialRiskUsers = [
    { name: 'Emma Davis', dept: 'HR', riskScore: 88, absentDays: 3, lastSeen: 'Hari ini, 10:05', status: 'Kritis' },
    { name: 'Sarah Wilson', dept: 'Marketing', riskScore: 76, absentDays: 2, lastSeen: 'Hari ini, 08:58', status: 'Tinggi' },
    { name: 'Livia S.', dept: 'Finance', riskScore: 71, absentDays: 2, lastSeen: 'Kemarin, 16:20', status: 'Tinggi' },
    { name: 'Aditiya R.', dept: 'Engineering', riskScore: 62, absentDays: 1, lastSeen: 'Hari ini, 09:12', status: 'Sedang' },
    { name: 'Michael Chen', dept: 'Design', riskScore: 59, absentDays: 1, lastSeen: 'Kemarin, 17:32', status: 'Sedang' },
    { name: 'James Wilson', dept: 'Engineering', riskScore: 52, absentDays: 0, lastSeen: 'Hari ini, 08:45', status: 'Terpantau' },
];

const initialMonitoringEvents = [
    { time: '10:22', title: 'Deteksi absen berulang', detail: 'Emma Davis absen 3 hari berturut', level: 'Kritis' },
    { time: '09:50', title: 'Indikator stres tinggi', detail: 'Sarah Wilson stres meningkat 12%', level: 'Tinggi' },
    { time: '09:10', title: 'Skor wellbeing turun', detail: 'Livia S. turun dari 7.2 ke 6.4', level: 'Sedang' },
    { time: '08:40', title: 'Kepatuhan check-in', detail: 'Tim Engineering check-in 92%', level: 'Stabil' },
];

const adminTrend = [
    { day: 'Mon', absent: 12, risk: 8, wellbeing: 7.2 },
    { day: 'Tue', absent: 9, risk: 10, wellbeing: 7.4 },
    { day: 'Wed', absent: 14, risk: 12, wellbeing: 6.9 },
    { day: 'Thu', absent: 11, risk: 9, wellbeing: 7.1 },
    { day: 'Fri', absent: 16, risk: 14, wellbeing: 6.6 },
    { day: 'Sat', absent: 7, risk: 6, wellbeing: 7.6 },
    { day: 'Sun', absent: 6, risk: 5, wellbeing: 7.8 },
];

const reportQueue = [
    { title: 'Analisis Risiko Mingguan', date: '2026-02-07', status: 'Siap Diunduh' },
    { title: 'Absensi vs Mental Load', date: '2026-02-06', status: 'Terkirim ke Admin' },
    { title: 'Heatmap Risiko Departemen', date: '2026-02-05', status: 'Siap Diunduh' },
];

export default function MentalHealth() {
    const [isDark, setIsDark] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [riskFilter, setRiskFilter] = useState('Semua');
    const [sortBy, setSortBy] = useState('Risiko Tertinggi');
    const [rangeFilter, setRangeFilter] = useState('7 Hari');
    const [reportFormat, setReportFormat] = useState('PDF');
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    
    // Real-time simulation state
    const [riskUsers, setRiskUsers] = useState(initialRiskUsers);
    const [monitoringEvents, setMonitoringEvents] = useState(initialMonitoringEvents);
    const [isAutoRefresh, setIsAutoRefresh] = useState(true);

    // Simulate real-time updates
    useEffect(() => {
        if (!isAutoRefresh) return;

        const interval = setInterval(() => {
            // Randomly update a risk score to simulate fluctuation
            setRiskUsers(prev => prev.map(user => {
                if (Math.random() > 0.7) {
                    const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                    const newScore = Math.max(0, Math.min(100, user.riskScore + change));
                    return { ...user, riskScore: newScore };
                }
                return user;
            }));

            // Occasionally add a new event
            if (Math.random() > 0.8) {
                const newEvent = {
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    title: 'Update Metrik Real-time',
                    detail: 'Sinkronisasi data terbaru berhasil',
                    level: 'Info'
                };
                setMonitoringEvents(prev => [newEvent, ...prev.slice(0, 4)]);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoRefresh]);

    const toggleDarkMode = () => setIsDark(!isDark);

    const filteredUsers = useMemo(() => {
        const byRisk = riskFilter === 'Semua' ? riskUsers : riskUsers.filter((user) => user.status === riskFilter);
        const bySearch = searchQuery.trim()
            ? byRisk.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : byRisk;
        const sorted = [...bySearch].sort((a, b) => {
            if (sortBy === 'Risiko Tertinggi') return b.riskScore - a.riskScore;
            if (sortBy === 'Absen Terbanyak') return b.absentDays - a.absentDays;
            return a.name.localeCompare(b.name);
        });
        return sorted;
    }, [riskFilter, searchQuery, sortBy, riskUsers]);

    const summary = useMemo(() => {
        const totalAbsent = adminTrend.reduce((acc, item) => acc + item.absent, 0);
        const avgWellbeing = adminTrend.reduce((acc, item) => acc + item.wellbeing, 0) / adminTrend.length;
        const highRiskCount = riskUsers.filter((user) => user.riskScore >= 75).length;
        return {
            totalAbsent,
            avgWellbeing: avgWellbeing.toFixed(1),
            highRiskCount,
            compliance: '92%',
        };
    }, [riskUsers]); // Updated dependency

    const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
    const cardBase = isDark
        ? 'bg-slate-900/70 border-slate-800 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)]'
        : 'bg-white border-gray-100 shadow-sm';
    const surface = isDark ? 'bg-slate-950 text-slate-100' : 'bg-transparent text-gray-900';
    const chip = isDark ? 'bg-slate-800 text-slate-200' : 'bg-gray-100 text-gray-600';

    return (
        <div className={`space-y-10 transition-colors duration-300 ${surface}`}>
            <section className={`relative overflow-hidden rounded-[32px] border p-8 md:p-12 ${cardBase}`}>
                <div className={`absolute inset-0 opacity-70 ${isDark ? 'bg-[radial-gradient(circle_at_top,_#1e293b_0%,_transparent_55%)]' : 'bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_transparent_55%)]'}`} />
                <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-5">
                        <div className="flex items-center gap-3 text-sm font-medium">
                            <span className={`px-4 py-2 rounded-full ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-primary-50 text-primary-700'}`}>
                                Admin Monitoring Center
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 ${chip}`}>
                                <span className="relative flex h-2 w-2">
                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAutoRefresh ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoRefresh ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                </span>
                                {isAutoRefresh ? 'Live Updates' : 'Paused'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Admin Mental Health Command Center
                        </h1>
                        <p className={`max-w-2xl text-base md:text-lg ${textMuted}`}>
                            Sistem monitoring untuk mendeteksi absensi, risiko mental, dan pola performa psikologis user secara real-time dengan visualisasi data yang responsif.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <button 
                                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${isDark ? 'bg-slate-100 text-slate-900 hover:bg-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                            >
                                <RefreshCw size={18} className={isAutoRefresh ? "animate-spin-slow" : ""} />
                                {isAutoRefresh ? 'Auto-Refresh On' : 'Enable Auto-Refresh'}
                            </button>
                            <button 
                                onClick={toggleDarkMode}
                                className={`px-5 py-2.5 rounded-xl font-medium border transition-all flex items-center gap-2 ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                                {isDark ? 'Light Mode' : 'Dark Mode'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/60 border-gray-100'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <span className="text-xs font-medium text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">+2.4%</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{summary.highRiskCount}</div>
                            <div className={`text-sm ${textMuted}`}>User Risiko Tinggi</div>
                        </div>
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/60 border-gray-100'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <Activity size={24} />
                                </div>
                                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">+1.8%</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{summary.avgWellbeing}</div>
                            <div className={`text-sm ${textMuted}`}>Rata-rata Wellbeing</div>
                        </div>
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/60 border-gray-100'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                    <Users size={24} />
                                </div>
                                <span className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">Stable</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{summary.totalAbsent}</div>
                            <div className={`text-sm ${textMuted}`}>Total Absensi (Minggu)</div>
                        </div>
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/60 border-gray-100'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <ShieldAlert size={24} />
                                </div>
                                <span className="text-xs font-medium text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-md">Target 95%</span>
                            </div>
                            <div className="text-3xl font-bold mb-1">{summary.compliance}</div>
                            <div className={`text-sm ${textMuted}`}>Kepatuhan Check-in</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
                <div className={`rounded-3xl border p-6 ${cardBase}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="text-blue-500" />
                                Tren Absensi vs Risiko Mental
                            </h2>
                            <p className={`text-sm mt-1 ${textMuted}`}>Analisis korelasi 7 hari terakhir</p>
                        </div>
                        <select 
                            value={rangeFilter}
                            onChange={(e) => setRangeFilter(e.target.value)}
                            className={`px-4 py-2 rounded-xl border outline-none text-sm font-medium ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                        >
                            <option>7 Hari</option>
                            <option>30 Hari</option>
                            <option>3 Bulan</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={adminTrend}>
                                <defs>
                                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorWell" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: isDark ? '#1e293b' : '#fff',
                                        color: isDark ? '#f1f5f9' : '#0f172a'
                                    }} 
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="risk" 
                                    name="Skor Risiko (Avg)" 
                                    stroke="#ef4444" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRisk)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="wellbeing" 
                                    name="Wellbeing Index" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorWell)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={`rounded-3xl border p-6 flex flex-col ${cardBase}`}>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="text-orange-500" />
                        Live Monitoring Feed
                    </h2>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[350px]">
                        {monitoringEvents.map((event, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                        event.level === 'Kritis' ? 'bg-red-100 text-red-600' :
                                        event.level === 'Tinggi' ? 'bg-orange-100 text-orange-600' :
                                        event.level === 'Info' ? 'bg-blue-100 text-blue-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                        {event.level}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">{event.time}</span>
                                </div>
                                <h3 className="font-bold text-sm mb-1">{event.title}</h3>
                                <p className={`text-xs ${textMuted}`}>{event.detail}</p>
                            </div>
                        ))}
                    </div>
                    <button className={`w-full mt-6 py-3 rounded-xl font-medium transition-colors text-sm ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                        View Full Event Log
                    </button>
                </div>
            </div>

            <section className={`rounded-[32px] border overflow-hidden ${cardBase}`}>
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Users className="text-indigo-500" />
                            Monitoring Risiko User
                        </h2>
                        <p className={`mt-2 ${textMuted}`}>Daftar karyawan yang memerlukan perhatian khusus berdasarkan analisis AI</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                            <Search size={18} className="text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari user..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none text-sm w-32 md:w-48 placeholder:text-gray-400"
                            />
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                            <Filter size={18} className="text-gray-400" />
                            <select 
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value)}
                                className="bg-transparent outline-none text-sm font-medium cursor-pointer"
                            >
                                <option value="Semua">Semua Status</option>
                                <option value="Kritis">Kritis</option>
                                <option value="Tinggi">Tinggi</option>
                                <option value="Sedang">Sedang</option>
                            </select>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                            <ArrowUpDown size={18} className="text-gray-400" />
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent outline-none text-sm font-medium cursor-pointer"
                            >
                                <option>Risiko Tertinggi</option>
                                <option>Absen Terbanyak</option>
                                <option>Nama (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b text-sm font-semibold ${isDark ? 'border-slate-800 text-slate-400 bg-slate-900/50' : 'border-gray-100 text-gray-500 bg-gray-50/50'}`}>
                                <th className="p-6 pl-8">Employee Profile</th>
                                <th className="p-6">Department</th>
                                <th className="p-6">Risk Score</th>
                                <th className="p-6">Absent (7d)</th>
                                <th className="p-6">Last Active</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 pr-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredUsers.map((user, idx) => (
                                <tr 
                                    key={idx} 
                                    className={`group border-b last:border-0 transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800/30' : 'border-gray-50 hover:bg-blue-50/30'}`}
                                >
                                    <td className="p-6 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                                idx % 3 === 0 ? 'bg-indigo-500' : idx % 3 === 1 ? 'bg-pink-500' : 'bg-teal-500'
                                            }`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-base">{user.name}</div>
                                                <div className={`text-xs ${textMuted}`}>ID: #{202400 + idx}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium">{user.dept}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        user.riskScore > 80 ? 'bg-red-500' : 
                                                        user.riskScore > 60 ? 'bg-orange-500' : 'bg-emerald-500'
                                                    }`} 
                                                    style={{ width: `${user.riskScore}%` }}
                                                />
                                            </div>
                                            <span className="font-bold">{user.riskScore}%</span>
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium text-center">{user.absentDays}</td>
                                    <td className={`p-6 ${textMuted}`}>{user.lastSeen}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            user.status === 'Kritis' ? 'bg-red-100 text-red-700' :
                                            user.status === 'Tinggi' ? 'bg-orange-100 text-orange-700' :
                                            user.status === 'Sedang' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-6 pr-8 text-right">
                                        <button 
                                            onClick={() => setActionMessage(`Notifikasi dikirim ke ${user.name}`)}
                                            className={`text-sm font-medium transition-colors ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                                        >
                                            Notify
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            Tidak ada data user yang sesuai filter.
                        </div>
                    )}
                </div>
            </section>

            <section className={`rounded-[32px] border p-8 md:p-12 ${cardBase}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <FileText className="text-teal-500" />
                            Auto Report System
                        </h2>
                        <p className={`mt-2 ${textMuted}`}>Generate laporan otomatis berdasarkan analisis AI mingguan</p>
                    </div>
                    <div className="flex gap-3">
                        <select 
                            value={reportFormat}
                            onChange={(e) => setReportFormat(e.target.value)}
                            className={`px-4 py-2 rounded-xl border outline-none font-medium ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}
                        >
                            <option>PDF Report</option>
                            <option>Excel Export</option>
                            <option>CSV Data</option>
                        </select>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg hover:shadow-teal-600/20 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Generate Report
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {reportQueue.map((report, idx) => (
                        <div key={idx} className={`p-6 rounded-2xl border group cursor-pointer transition-all hover:-translate-y-1 ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-teal-500/50' : 'bg-gray-50 border-gray-100 hover:border-teal-200'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-900 text-teal-400' : 'bg-white text-teal-600 shadow-sm'}`}>
                                    <FileText size={24} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                    report.status === 'Siap Diunduh' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {report.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-teal-600 transition-colors">{report.title}</h3>
                            <p className={`text-sm mb-4 ${textMuted}`}>Generated on {report.date}</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-teal-600">
                                <Download size={16} />
                                Download File
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {actionMessage && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 z-50 flex items-center gap-3">
                    <CheckCircle2 className="text-green-400" />
                    {actionMessage}
                    <button onClick={() => setActionMessage(null)} className="ml-2 text-slate-400 hover:text-white">✕</button>
                </div>
            )}
        </div>
    );
}
