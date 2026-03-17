'use client'
import { useEffect, useState } from 'react'
import { countersApi, branchesApi } from '@/lib/api'
import { Counter, Branch } from '@/types'

export default function CountersPage() {
  const [counters, setCounters] = useState<Counter[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [form, setForm] = useState({ branchId: '', name: '', code: '' })
  const [showForm, setShowForm] = useState(false)

  const load = () => countersApi.getAll().then(setCounters)
  useEffect(() => { load(); branchesApi.getAll().then(setBranches) }, [])

  const save = async () => {
    await countersApi.create(form)
    setForm({ branchId: '', name: '', code: '' })
    setShowForm(false)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Counters</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">+ Add Counter</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 max-w-lg space-y-3">
          <h2 className="font-semibold text-gray-700">New Counter</h2>
          <select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select branch...</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          {[{ key: 'name', label: 'Counter Name' }, { key: 'code', label: 'Code' }].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Save</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {counters.map(c => {
          const activeSession = c.sessions?.find((s: any) => !s.endedAt)
          return (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <span className="text-xs text-gray-400 font-mono">{c.code}</span>
              </div>
              {activeSession ? (
                <div className="text-xs text-green-600 font-medium">🟢 {(activeSession as any).user?.firstName} active</div>
              ) : (
                <div className="text-xs text-gray-400">⚫ No active session</div>
              )}
              <button onClick={async () => { if (confirm('Delete counter?')) { await countersApi.delete(c.id); load() } }} className="mt-3 text-xs text-red-500 hover:text-red-700">Delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
