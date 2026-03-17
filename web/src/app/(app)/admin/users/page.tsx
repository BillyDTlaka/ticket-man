'use client'
import { useEffect, useState } from 'react'
import { usersApi, branchesApi } from '@/lib/api'
import { User, Branch, UserRole } from '@/types'

const ROLES: UserRole[] = ['ADMIN', 'SUPERVISOR', 'AGENT', 'RECEPTION']
const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  SUPERVISOR: 'bg-purple-100 text-purple-700',
  AGENT: 'bg-blue-100 text-blue-700',
  RECEPTION: 'bg-green-100 text-green-700',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'AGENT' as UserRole, branchId: '' })
  const [showForm, setShowForm] = useState(false)

  const load = () => usersApi.getAll().then(setUsers)
  useEffect(() => { load(); branchesApi.getAll().then(setBranches) }, [])

  const save = async () => {
    await usersApi.create(form)
    setForm({ email: '', password: '', firstName: '', lastName: '', role: 'AGENT', branchId: '' })
    setShowForm(false)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">+ Add User</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 max-w-lg space-y-3">
          <h2 className="font-semibold text-gray-700">New User</h2>
          {[{ key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' }, { key: 'email', label: 'Email' }, { key: 'password', label: 'Password' }].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
              <input type={f.key === 'password' ? 'password' : 'text'} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Branch</label>
            <select value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">None</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Save</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{['Name', 'Email', 'Role', 'Branch', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                <td className="px-5 py-3 text-gray-500">{u.email}</td>
                <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                <td className="px-5 py-3 text-gray-500">{u.branch?.name || '—'}</td>
                <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-5 py-3">
                  <button onClick={async () => { if (confirm('Delete user?')) { await usersApi.delete(u.id); load() } }} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
