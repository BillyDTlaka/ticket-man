'use client'
import { useEffect, useState } from 'react'
import { branchesApi } from '@/lib/api'
import { Branch } from '@/types'

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [form, setForm] = useState({ name: '', code: '', address: '' })
  const [editing, setEditing] = useState<Branch | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => branchesApi.getAll().then(setBranches)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (editing) await branchesApi.update(editing.id, form)
    else await branchesApi.create(form)
    setForm({ name: '', code: '', address: '' })
    setEditing(null)
    setShowForm(false)
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this branch?')) return
    await branchesApi.delete(id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', code: '', address: '' }) }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">+ Add Branch</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 max-w-lg space-y-3">
          <h2 className="font-semibold text-gray-700">{editing ? 'Edit' : 'New'} Branch</h2>
          {['name', 'code', 'address'].map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{field}</label>
              <input
                value={(form as any)[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            <tr>
              {['Name', 'Code', 'Address', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {branches.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{b.name}</td>
                <td className="px-5 py-3 text-gray-500">{b.code}</td>
                <td className="px-5 py-3 text-gray-500">{b.address || '—'}</td>
                <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-5 py-3 flex gap-2">
                  <button onClick={() => { setEditing(b); setForm({ name: b.name, code: b.code, address: b.address || '' }); setShowForm(true) }} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                  <button onClick={() => del(b.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
