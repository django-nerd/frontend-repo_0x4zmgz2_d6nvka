import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

  async function fetchProjects() {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/projects`)
      const data = await res.json()
      setProjects(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function addProject(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      setSaving(true)
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, description: form.description })
      })
      const created = await res.json()
      setProjects([created, ...projects])
      setForm({ name: '', description: '' })
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  async function removeProject(id) {
    try {
      await fetch(`${API_BASE}/api/projects/${id}`, { method: 'DELETE' })
      setProjects(projects.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="px-6 py-5 border-b bg-white/60 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">SaaS Starter</h1>
          <div className="text-slate-500">Simple projects dashboard</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid gap-6">
        <section className="bg-white rounded-xl shadow-sm border p-5">
          <h2 className="text-lg font-medium text-slate-800 mb-3">Create project</h2>
          <form onSubmit={addProject} className="grid gap-3 sm:grid-cols-3">
            <input
              className="border rounded-lg px-3 py-2 sm:col-span-1"
              placeholder="Project name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border rounded-lg px-3 py-2 sm:col-span-1"
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-60"
            >{saving ? 'Adding...' : 'Add project'}</button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-slate-800">Projects</h2>
            <button
              onClick={fetchProjects}
              className="text-sm text-slate-600 hover:text-slate-900"
            >Refresh</button>
          </div>
          {loading ? (
            <div className="text-slate-500">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-slate-500">No projects yet. Create your first project above.</div>
          ) : (
            <ul className="divide-y">
              {projects.map(p => (
                <li key={p.id} className="py-3 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{p.name}</div>
                    {p.description && (
                      <div className="text-slate-600 text-sm">{p.description}</div>
                    )}
                  </div>
                  <button
                    onClick={() => removeProject(p.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >Delete</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="py-6 text-center text-slate-500 text-sm">Built with FastAPI + React</footer>
    </div>
  )
}

export default App
