'use client'
import { useEffect, useState, useRef } from 'react'
import { branchesApi, servicesApi, ticketsApi } from '@/lib/api'
import { Branch, ServiceCategory, Ticket } from '@/types'
import { useAuthStore } from '@/store/auth.store'

export default function ReceptionPage() {
  const { user } = useAuthStore()
  const [branches, setBranches] = useState<Branch[]>([])
  const [services, setServices] = useState<ServiceCategory[]>([])
  const [branchId, setBranchId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [lastTicket, setLastTicket] = useState<Ticket | null>(null)
  const [issuing, setIssuing] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    branchesApi.getAll().then(setBranches)
  }, [])

  useEffect(() => {
    if (user?.branchId) setBranchId(user.branchId)
  }, [user])

  useEffect(() => {
    if (branchId) servicesApi.getAll(branchId).then(setServices)
  }, [branchId])

  const issue = async () => {
    if (!branchId || !serviceId) return
    setIssuing(true)
    try {
      const ticket = await ticketsApi.issue(branchId, serviceId)
      setLastTicket(ticket)
      setTimeout(() => window.print(), 300)
    } finally {
      setIssuing(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Issue Ticket</h1>

      <div className="max-w-xl bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
          <select
            value={branchId}
            onChange={(e) => { setBranchId(e.target.value); setServiceId('') }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select branch...</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            disabled={!branchId}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">Select service...</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <button
          onClick={issue}
          disabled={!branchId || !serviceId || issuing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 text-lg"
        >
          {issuing ? 'Issuing...' : '🎫 Issue & Print Ticket'}
        </button>
      </div>

      {/* Ticket preview + print area */}
      {lastTicket && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Last Issued Ticket</h2>
          <div ref={printRef} id="print-ticket" className="inline-block bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center min-w-[280px] print:border-solid print:rounded-none print:shadow-none">
            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">{lastTicket.branch?.name}</div>
            <div className="text-gray-600 text-sm mt-1">{lastTicket.serviceCategory?.name}</div>
            <div className="text-7xl font-black text-blue-700 my-6">{lastTicket.ticketNumber}</div>
            <div className="text-gray-400 text-xs">{new Date(lastTicket.issuedAt).toLocaleString()}</div>
            <div className="mt-4 text-xs text-gray-400">Please wait to be called</div>
          </div>
          <div className="mt-4">
            <button onClick={() => window.print()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              🖨️ Print Again
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-ticket { display: block !important; position: fixed; top: 0; left: 0; width: 80mm; }
        }
      `}</style>
    </div>
  )
}
