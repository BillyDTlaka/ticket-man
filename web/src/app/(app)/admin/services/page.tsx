'use client'
import { useEffect, useState } from 'react'
import { servicesApi, branchesApi } from '@/lib/api'
import { ServiceCategory, Branch } from '@/types'

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceCategory[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [form, setForm] = useState({ branchId: '', name: '', code: '', prefix: 'A', description: '' })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ServiceCategory | null>(null)

  const load = () => servicesApi.getAll().then(setServices)
  useEffect(() => { load(); branchesApi.getAll().then(setBranches) }, [])

  const save = async () => {
    if (editing) await servicesApi.update(editing.id, form)
    else await servicesApi.create(form)
    setForm({ branchId: '', name: '', code: '', prefix: 'A', description: '' })
    setEditing(null)
    setShowForm(false)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
        <button onClick={() => { setShowForm(true); setEditing(null) }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">+ Add Service</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 max-w-lg space-y-3">
          <h2 className="font-semibold text-gray-700">{editing ? 'Edit' : 'New'} Service</h2>
          <select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select branch...</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          {[{ key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, { key: 'prefix', label: 'Ticket Prefix (e.g. A)' }, { key: 'description', label: 'Description' }].map(f => (
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{['Name', 'Code', 'Prefix', 'Branch', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{s.name}</td>
                <td className="px-5 py-3 text-gray-500">{s.code}</td>
                <td className="px-5 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono text-xs">{s.prefix}001</span></td>
                <td className="px-5 py-3 text-gray-500">{branches.find(b => b.id === s.branchId)?.name || '—'}</td>
                <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-5 py-3">
                  <button onClick={() => { setEditing(s); setForm({ branchId: s.branchId, name: s.name, code: s.code, prefix: s.prefix, description: s.description || '' }); setShowForm(true) }} className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-2">Edit</button>
                  <button onClick={async () => { if (confirm('Delete?')) { await servicesApi.delete(s.id); load() } }} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
