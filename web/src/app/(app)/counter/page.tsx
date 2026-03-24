'use client'
// v1.0.1
import { useEffect, useState } from 'react'
import { countersApi, servicesApi, ticketsApi } from '@/lib/api'
import { Counter, ServiceCategory, Ticket } from '@/types'
import { useAuthStore } from '@/store/auth.store'

const STATUS_COLORS: Record<string, string> = {
  CREATED: 'bg-yellow-100 text-yellow-700',
  CALLED: 'bg-blue-100 text-blue-700',
  IN_SERVICE: 'bg-purple-100 text-purple-700',
  SERVED: 'bg-green-100 text-green-700',
  NO_SHOW: 'bg-red-100 text-red-700',
}

export default function CounterPage() {
  const { user } = useAuthStore()
  const [counters, setCounters] = useState<Counter[]>([])
  const [services, setServices] = useState<ServiceCategory[]>([])
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [queueCount, setQueueCount] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)

  useEffect(() => {
    if (user?.branchId) {
      countersApi.getAll(user.branchId).then(setCounters)
      servicesApi.getAll(user.branchId).then(setServices)
      countersApi.getActiveSession().then(session => {
        if (session) {
          setSelectedCounter(session.counter)
          setSessionActive(true)
        }
      })
    }
  }, [user])

  useEffect(() => {
    if (selectedService) refreshQueueCount()
  }, [selectedService])

  const refreshQueueCount = async () => {
    if (!selectedService) return
    const tickets = await ticketsApi.getAll({ serviceCategoryId: selectedService.id, status: 'CREATED' })
    setQueueCount(tickets.length)
  }

  const openSession = async () => {
    if (!selectedCounter) return
    await countersApi.openSession(selectedCounter.id)
    setSessionActive(true)
  }

  const closeSession = async () => {
    await countersApi.closeSession()
    setSessionActive(false)
    setCurrentTicket(null)
  }

  const callNext = async () => {
    if (!selectedCounter || !selectedService) return
    try {
      const ticket = await ticketsApi.callNext(selectedCounter.id, selectedService.id)
      setCurrentTicket(ticket)
      await refreshQueueCount()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'No tickets waiting')
    }
  }

  const action = async (fn: () => Promise<Ticket>) => {
    const updated = await fn()
    setCurrentTicket(updated)
    if (updated.status === 'SERVED' || updated.status === 'NO_SHOW') {
      setCurrentTicket(null)
      await refreshQueueCount()
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Counter</h1>

      {/* Counter + Service Selection */}
      {!sessionActive && (
        <div className="max-w-xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 mb-6">
          <h2 className="font-semibold text-gray-700">Open Counter Session</h2>
          <select
            value={selectedCounter?.id || ''}
            onChange={(e) => setSelectedCounter(counters.find(c => c.id === e.target.value) || null)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select counter...</option>
            {counters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button
            onClick={openSession}
            disabled={!selectedCounter}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            Open Session
          </button>
        </div>
      )}

      {sessionActive && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                🟢 {selectedCounter?.name} — Active
              </div>
            </div>
            <button onClick={closeSession} className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition">
              Close Session
            </button>
          </div>

          {/* Service selector */}
          <div className="max-w-xs mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">Serving queue</label>
            <select
              value={selectedService?.id || ''}
              onChange={(e) => setSelectedService(services.find(s => s.id === e.target.value) || null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Select service...</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Queue info */}
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-3xl font-black text-blue-700">{queueCount}</div>
              <div className="text-xs text-gray-500 mt-1">Waiting</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-3xl font-black text-purple-700">{currentTicket ? '1' : '0'}</div>
              <div className="text-xs text-gray-500 mt-1">In Service</div>
            </div>
          </div>

          {/* Current ticket */}
          {currentTicket ? (
            <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-6 max-w-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Current Ticket</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[currentTicket.status]}`}>{currentTicket.status}</span>
              </div>
              <div className="text-6xl font-black text-blue-700 mb-2">{currentTicket.ticketNumber}</div>
              <div className="text-gray-500 text-sm">{currentTicket.serviceCategory?.name}</div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {currentTicket.status === 'CALLED' && (
                  <>
                    <button onClick={() => action(() => ticketsApi.startService(currentTicket.id))} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition text-sm">▶ Start Service</button>
                    <button onClick={() => action(() => ticketsApi.recall(currentTicket.id))} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition text-sm">🔔 Recall</button>
                    <button onClick={() => action(() => ticketsApi.noShow(currentTicket.id))} className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-lg transition text-sm">✗ No Show</button>
                  </>
                )}
                {currentTicket.status === 'IN_SERVICE' && (
                  <button onClick={() => action(() => ticketsApi.endService(currentTicket.id))} className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">✓ End Service</button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 text-center max-w-md mb-6">
              <div className="text-gray-400 text-4xl mb-2">🎫</div>
              <div className="text-gray-500 text-sm">No ticket currently being served</div>
            </div>
          )}

          {!currentTicket && (
            <button
              onClick={callNext}
              disabled={!selectedService}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition disabled:opacity-50 shadow-lg"
            >
              📣 Call Next
            </button>
          )}
        </>
      )}
    </div>
  )
}
