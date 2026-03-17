'use client'
import { useEffect, useState } from 'react'
import { ticketsApi, countersApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

export default function SupervisorPage() {
  const { user } = useAuthStore()
  const [snapshot, setSnapshot] = useState<any[]>([])
  const [counters, setCounters] = useState<any[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const refresh = async () => {
    if (!user?.branchId) return
    const [snap, ctrs] = await Promise.all([
      ticketsApi.getQueueSnapshot(user.branchId),
      countersApi.getAll(user.branchId),
    ])
    setSnapshot(snap)
    setCounters(ctrs)
    setLastRefresh(new Date())
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [user])

  const totalWaiting = snapshot.reduce((sum, s) => sum + s.waiting, 0)
  const totalServing = snapshot.reduce((sum, s) => sum + s.serving.length, 0)
  const activeCounters = counters.filter(c => c.sessions?.some((s: any) => !s.endedAt)).length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <button onClick={refresh} className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg transition">↻ Refresh</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Waiting', value: totalWaiting, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'In Service', value: totalServing, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Active Counters', value: activeCounters, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} rounded-xl p-5`}>
            <div className={`text-3xl font-black ${card.color}`}>{card.value}</div>
            <div className="text-gray-500 text-sm mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Queue by service */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Queue by Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {snapshot.map((item) => (
          <div key={item.service.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{item.service.name}</h3>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{item.service.prefix}xxx</span>
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-2xl font-black text-yellow-600">{item.waiting}</div>
                <div className="text-xs text-gray-400">Waiting</div>
              </div>
              <div>
                <div className="text-2xl font-black text-purple-600">{item.serving.length}</div>
                <div className="text-xs text-gray-400">Serving</div>
              </div>
            </div>
            {item.serving.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                {item.serving.map((t: any) => (
                  <div key={t.id} className="flex justify-between text-sm">
                    <span className="font-semibold text-blue-700">{t.ticketNumber}</span>
                    <span className="text-gray-400">{t.counter?.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Counters status */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Counter Status</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {counters.map((counter) => {
          const activeSession = counter.sessions?.find((s: any) => !s.endedAt)
          return (
            <div key={counter.id} className={`rounded-xl border p-4 ${activeSession ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="font-semibold text-gray-800 text-sm">{counter.name}</div>
              {activeSession ? (
                <div className="text-xs text-green-600 mt-1 font-medium">
                  🟢 {activeSession.user?.firstName} {activeSession.user?.lastName}
                </div>
              ) : (
                <div className="text-xs text-gray-400 mt-1">⚫ Inactive</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
