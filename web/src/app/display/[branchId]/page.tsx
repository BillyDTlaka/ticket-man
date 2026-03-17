'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'

interface CalledTicket {
  id: string
  ticketNumber: string
  serviceCategory: { name: string }
  counter?: { name: string }
  calledAt?: string
}

export default function DisplayPage() {
  const { branchId } = useParams<{ branchId: string }>()
  const [tickets, setTickets] = useState<CalledTicket[]>([])
  const [latest, setLatest] = useState<CalledTicket | null>(null)
  const [flash, setFlash] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    // Initial load
    fetch(`${apiUrl}/display/${branchId}`)
      .then(r => r.json())
      .then(data => { if (data.recentlyCalled) setTickets(data.recentlyCalled) })

    // SSE connection
    const es = new EventSource(`${apiUrl}/display/sse/${branchId}`)
    eventSourceRef.current = es

    es.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.type === 'SNAPSHOT') {
        setTickets(data.tickets)
      } else if (data.type === 'TICKET_CALLED') {
        setLatest(data.ticket)
        setFlash(true)
        setTickets(prev => [data.ticket, ...prev.slice(0, 9)])
        setTimeout(() => setFlash(false), 3000)
      }
    }

    return () => es.close()
  }, [branchId])

  const nowServing = tickets[0] || null

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="bg-blue-800 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎫 Queue Display</h1>
          <p className="text-blue-300 text-sm">Please wait for your number to be called</p>
        </div>
        <div className="text-blue-300 text-sm">{new Date().toLocaleDateString()}</div>
      </div>

      <div className="flex flex-1 gap-0">
        {/* Now Serving - big left panel */}
        <div className={`flex-1 flex flex-col items-center justify-center p-12 transition-all duration-500 ${flash ? 'bg-blue-700' : 'bg-gray-800'}`}>
          <div className="text-blue-300 text-lg font-semibold uppercase tracking-widest mb-4">Now Serving</div>
          {nowServing ? (
            <>
              <div className={`text-[10rem] font-black leading-none tracking-tight transition-all ${flash ? 'text-white scale-110' : 'text-blue-400'}`}>
                {nowServing.ticketNumber}
              </div>
              <div className="mt-6 text-center">
                <div className="text-2xl text-gray-300">{nowServing.serviceCategory?.name}</div>
                <div className="text-xl text-blue-300 mt-2">{nowServing.counter?.name || ''}</div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-2xl">Waiting for tickets...</div>
          )}
        </div>

        {/* Recently called - right panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Recently Called</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            {tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className={`flex items-center justify-between px-6 py-4 border-b border-gray-700 ${i === 0 ? 'bg-blue-900' : ''}`}
              >
                <div>
                  <div className={`text-2xl font-black ${i === 0 ? 'text-blue-300' : 'text-gray-300'}`}>{ticket.ticketNumber}</div>
                  <div className="text-xs text-gray-500">{ticket.serviceCategory?.name}</div>
                </div>
                <div className="text-sm text-gray-400">{ticket.counter?.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="bg-blue-900 px-8 py-3 text-blue-200 text-sm">
        Thank you for visiting — we value your time and aim to serve you efficiently.
      </div>
    </div>
  )
}
