'use client'
import { useEffect, useState } from 'react'
import { reportsApi, branchesApi } from '@/lib/api'
import { Branch } from '@/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'
import { useAuthStore } from '@/store/auth.store'

export default function ReportsPage() {
  const { user } = useAuthStore()
  const [branches, setBranches] = useState<Branch[]>([])
  const [branchId, setBranchId] = useState('')
  const [from, setFrom] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'))
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    branchesApi.getAll().then(setBranches)
    if (user?.branchId) setBranchId(user.branchId)
  }, [user])

  const load = async () => {
    if (!branchId) return
    setLoading(true)
    try {
      const data = await reportsApi.getSummary(branchId, from, to)
      setReport(data)
    } finally {
      setLoading(false)
    }
  }

  const exportCsv = async () => {
    const blob = await reportsApi.exportCsv(branchId, from, to)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${from}-${to}.csv`
    a.click()
  }

  const peakHoursData = report
    ? Object.entries(report.peakHours).map(([hour, count]) => ({ hour: `${hour}:00`, count })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
    : []

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Branch</label>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button onClick={load} disabled={!branchId || loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50 text-sm">
          {loading ? 'Loading...' : 'Run Report'}
        </button>
        {report && (
          <button onClick={exportCsv} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition text-sm">
            ⬇ Export CSV
          </button>
        )}
      </div>

      {report && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Tickets', value: report.total, color: 'text-blue-700' },
              { label: 'Served', value: report.served, color: 'text-green-600' },
              { label: 'No Show', value: report.noShow, color: 'text-red-500' },
              { label: 'Avg Wait', value: `${report.avgWaitMinutes} min`, color: 'text-purple-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* By service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">By Service Category</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs border-b border-gray-100">
                    <th className="pb-2">Service</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Served</th>
                    <th className="pb-2">Avg Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {report.serviceStats.map((s: any) => (
                    <tr key={s.service}>
                      <td className="py-2 font-medium text-gray-800">{s.service}</td>
                      <td className="py-2 text-gray-600">{s.total}</td>
                      <td className="py-2 text-green-600">{s.served}</td>
                      <td className="py-2 text-gray-600">{s.avgServiceMinutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Peak Hours</h2>
              {peakHoursData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={peakHoursData}>
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-400 py-12 text-sm">No data for selected period</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
