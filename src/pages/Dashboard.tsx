import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Smile } from 'lucide-react';

const moodData = [
    { day: 'Mon', mood: 7, stress: 3 },
    { day: 'Tue', mood: 6, stress: 4 },
    { day: 'Wed', mood: 8, stress: 2 },
    { day: 'Thu', mood: 5, stress: 6 },
    { day: 'Fri', mood: 7, stress: 3 },
    { day: 'Sat', mood: 9, stress: 1 },
    { day: 'Sun', mood: 8, stress: 2 },
];

const emotionData = [
    { name: 'Happy', value: 45, color: '#10b981' },
    { name: 'Neutral', value: 30, color: '#f59e0b' },
    { name: 'Stressed', value: 15, color: '#ef4444' },
    { name: 'Tired', value: 10, color: '#6366f1' },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mental Health Overview</h1>
                    <p className="text-gray-500">Weekly mental wellness tracking</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white border rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-50">
                        <option>This Week</option>
                        <option>Last Week</option>
                        <option>This Month</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Smile, label: 'Avg Mood Score', value: '7.2/10', change: '+0.5', color: 'text-green-600', bg: 'bg-green-50' },
                    { icon: Brain, label: 'Mental Focus', value: '85%', change: '+2%', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { icon: AlertTriangle, label: 'Stress Level', value: 'Low', change: '-12%', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { icon: TrendingUp, label: 'Consistency', value: '94%', change: '+5%', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((card, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                                <card.icon size={22} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${card.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {card.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{card.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-6">Mood vs Stress Timeline</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={moodData}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="mood" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" name="Mood" />
                                <Area type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorStress)" name="Stress" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Widget */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-6">Emotion Breakdown</h3>
                    <div className="space-y-4">
                        {emotionData.map((item) => (
                            <div key={item.name} className="flex items-center gap-4">
                                <div className="w-2 h-12 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                        <span className="text-gray-500">{item.value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-primary-50 rounded-xl">
                        <h4 className="font-medium text-primary-800 mb-2">Daily Tip</h4>
                        <p className="text-sm text-primary-600">Take a 5-minute break every hour to reduce screen fatigue and improve focus.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
