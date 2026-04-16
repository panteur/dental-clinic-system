'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

const ROLES = { ADMIN: 'admin', DENTIST: 'dentista', RECEPTIONIST: 'recepcionista' }

function StatusBadge({ status }) {
  const styles = {
    pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completada: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelada: 'bg-red-50 text-red-700 border-red-200',
    no_presento: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  const labels = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    completada: 'Completada',
    cancelada: 'Cancelada',
    no_presento: 'No se presentó',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pendiente}`}>
      {labels[status] || status}
    </span>
  )
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{value ?? '—'}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

/* ─── ADMIN DASHBOARD ─── */
function AdminDashboard({ api }) {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, statsRes] = await Promise.all([
          api.get('/users'),
          api.get('/appointments/stats'),
        ])
        setUsers(usersRes.data.users || [])
        setStats(statsRes.data.stats || {})
      } catch (err) {
        console.error(err)
      }
    }
    load().finally(() => setLoading(false))
  }, [])

  const roleLabels = { admin: 'Administrador', dentista: 'Dentista', recepcionista: 'Recepcionista' }
  const roleColors = {
    admin: 'bg-violet-100 text-violet-700',
    dentista: 'bg-sky-100 text-sky-700',
    recepcionista: 'bg-emerald-100 text-emerald-700',
  }

  const totalUsers = users.length
  const byRole = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1
    return acc
  }, {})

  if (loading) return <DashboardSkeleton />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
        <p className="text-slate-500 mt-1">Resumen del sistema y gestión de usuarios</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Usuarios"
          value={totalUsers}
          color="bg-violet-100 text-violet-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
        />
        <StatCard
          label="Dentistas"
          value={byRole.dentista || 0}
          color="bg-sky-100 text-sky-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
        />
        <StatCard
          label="Recepcionistas"
          value={byRole.recepcionista || 0}
          color="bg-emerald-100 text-emerald-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.355 0-2.697-.056-4.024-.166-1.133-.093-1.99-.85-2.217-1.945C8.668 12.21 8.45 12 8.25 12a3.75 3.75 0 01-2.25-6.79c.534-.304 1.166-.488 1.87-.655M20.25 8.511V12a3 3 0 01-3 3m-11.5-3.5H7.5m0 0v6m0-6H6m12 0v6m0 0H17m-4.5 0H3" /></svg>}
        />
        <StatCard
          label="Citas Totales"
          value={stats.total || 0}
          color="bg-slate-100 text-slate-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
        />
      </div>

      {/* Pending / Confirmed / Completed */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Pendientes" value={stats.pending || 0} color="bg-amber-100 text-amber-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Confirmadas" value={stats.confirmed || 0} color="bg-emerald-100 text-emerald-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Completadas" value={stats.completed || 0} color="bg-blue-100 text-blue-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Usuarios del Sistema</h2>
          <Link href="/dashboard/users" className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
            Ver todos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Especialidad</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.slice(0, 8).map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                        {u.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-slate-900 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.specialty || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleColors[u.role] || 'bg-slate-100 text-slate-600'}`}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {u.active !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center py-12 text-slate-400 text-sm">No hay usuarios registrados.</p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── DENTIST DASHBOARD ─── */
function DentistDashboard({ api, user }) {
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    async function load() {
      try {
        const today = format(new Date(), 'yyyy-MM-dd')
        const weekStart = format(new Date(), 'yyyy-MM-dd')
        const weekEnd = format(addDays(new Date(), 7), 'yyyy-MM-dd')
        const [aptRes, statsRes] = await Promise.all([
          api.get(`/appointments/by-range?dentist_id=${user.id}&start_date=${weekStart}&end_date=${weekEnd}`),
          api.get(`/appointments/stats?dentist_id=${user.id}`),
        ])
        setAppointments(aptRes.data.appointments || [])
        setStats(statsRes.data.stats || {})
      } catch (err) {
        console.error(err)
      }
    }
    load().finally(() => setLoading(false))
  }, [user.id])

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  const dayAppointments = appointments.filter(a => {
    const aptDate = new Date(a.date)
    return aptDate.toDateString() === selectedDate.toDateString()
  })

  if (loading) return <DashboardSkeleton />

  const todayApts = appointments.filter(a => {
    const aptDate = new Date(a.date)
    return aptDate.toDateString() === new Date().toDateString()
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mi Agenda</h1>
        <p className="text-slate-500 mt-1">Citas y disponibilidad para los próximos días</p>
      </div>

      {/* Dentist Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Citas Hoy" value={todayApts.length} color="bg-sky-100 text-sky-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
        />
        <StatCard label="Pendientes" value={stats.pending || 0} color="bg-amber-100 text-amber-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Confirmadas" value={stats.confirmed || 0} color="bg-emerald-100 text-emerald-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Esta Semana" value={appointments.length} color="bg-violet-100 text-violet-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.689V8.69zM12 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.06a1.125 1.125 0 01-1.683-.976V8.69z" /></svg>}
        />
      </div>

      {/* Week Calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Selecciona un día</h2>
        </div>
        <div className="flex overflow-x-auto">
          {weekDates.map((date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString()
            const isToday = date.toDateString() === new Date().toDateString()
            const dayApts = appointments.filter(a => {
              const aptDate = new Date(a.date)
              return aptDate.toDateString() === date.toDateString()
            })
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-4 min-w-[80px] border-r border-slate-100 last:border-r-0 transition-all ${
                  isSelected ? 'bg-sky-50 border-b-2 border-b-sky-500' : 'hover:bg-slate-50'
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${isSelected ? 'text-sky-600' : 'text-slate-400'}`}>
                  {format(date, 'EEE', { locale: es })}
                </span>
                <span className={`text-2xl font-extrabold mt-1 ${isSelected ? 'text-sky-700' : 'text-slate-800'}`}>
                  {format(date, 'd')}
                </span>
                {dayApts.length > 0 && (
                  <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-600'
                  }`}>
                    {dayApts.length} {dayApts.length === 1 ? 'cita' : 'citas'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Citas del {format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}
          </h2>
          <span className="text-sm text-slate-500">{dayAppointments.length} cita{dayAppointments.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {dayAppointments.length > 0 ? (
            dayAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((apt) => (
                <div key={apt.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 text-center">
                      <span className="text-xl font-bold text-slate-900">{apt.time?.substring(0, 5)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">{apt.patient_name} {apt.patient_last_name}</p>
                          <p className="text-sm text-slate-500 mt-0.5">{apt.service_name}</p>
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-slate-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <p className="text-slate-400 text-sm font-medium">No hay citas para este día</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── RECEPTIONIST DASHBOARD ─── */
function ReceptionistDashboard({ api }) {
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    async function load() {
      try {
        const today = format(new Date(), 'yyyy-MM-dd')
        const future = format(addDays(new Date(), 30), 'yyyy-MM-dd')
        const [aptRes, statsRes] = await Promise.all([
          api.get(`/appointments/by-range?start_date=${today}&end_date=${future}`),
          api.get('/appointments/stats'),
        ])
        setAppointments(aptRes.data.appointments || [])
        setStats(statsRes.data.stats || {})
      } catch (err) {
        console.error(err)
      }
    }
    load().finally(() => setLoading(false))
  }, [])

  const filterOptions = [
    { key: 'pending', label: 'Pendientes', color: 'text-amber-600' },
    { key: 'confirmed', label: 'Confirmadas', color: 'text-emerald-600' },
    { key: 'today', label: 'Hoy', color: 'text-sky-600' },
    { key: 'all', label: 'Todas (activas)', color: 'text-slate-600' },
  ]

  const filtered = appointments.filter(a => {
    if (filter === 'pending') return a.status === 'pendiente'
    if (filter === 'confirmed') return a.status === 'confirmada'
    if (filter === 'today') {
      const today = format(new Date(), 'yyyy-MM-dd')
      return a.date === today
    }
    return a.status !== 'cancelada' && a.status !== 'completada'
  })

  if (loading) return <DashboardSkeleton />

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Citas</h1>
        <p className="text-slate-500 mt-1">Todas las reservas activas y pendientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pendientes" value={stats.pending || 0} color="bg-amber-100 text-amber-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Confirmadas" value={stats.confirmed || 0} color="bg-emerald-100 text-emerald-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Completadas" value={stats.completed || 0} color="bg-blue-100 text-blue-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        />
        <StatCard label="Canceladas" value={stats.cancelled || 0} color="bg-red-100 text-red-600"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
        />
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2">
          {filterOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === opt.key
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="divide-y divide-slate-100">
          {filtered.length > 0 ? (
            filtered
              .sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date)
                if (dateCompare !== 0) return dateCompare
                return a.time.localeCompare(b.time)
              })
              .map((apt) => (
                <div key={apt.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {apt.patient_name?.[0]}{apt.patient_last_name?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{apt.patient_name} {apt.patient_last_name}</p>
                        <p className="text-xs text-slate-500">{apt.service_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-800">{format(new Date(apt.date), "d MMM yyyy", { locale: es })}</p>
                        <p className="text-xs text-slate-500">{apt.time?.substring(0, 5)}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400">{apt.dentist_name}</p>
                        <p className="text-xs text-slate-400">{apt.dentist_specialty}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-slate-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621-1.093-1.745-1.87-3.074-1.87C1.005 6.38 0 7.343 0 8.25v.75c0 1.094.787 1.972 1.87 1.87H3.375m0-3.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H3.375m12.375 0v1.5c0 .621-.504 1.125-1.125 1.125h-1.5m0-3.75c0 .621-.504 1.125-1.125 1.125h-1.5m-6.75 0c-.375 0-.75.504-.75 1.125v.75c0 .621.375 1.125.75 1.125h.75m6.75 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5m0-3.75c0 .621-.504 1.125-1.125 1.125h-1.5M3.375 3.75c-.621 0-1.125.504-1.125 1.125v.75c0 .621.504 1.125 1.125 1.125H4.5m0 0h4.5m-4.5 0c-.621 0-1.125.504-1.125 1.125v.75c0 .621.504 1.125 1.125 1.125h1.5m0 0H9m0 0h4.5m0 0c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-1.5M6.75 3.75h12.75c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-1.5M3.375 8.25h16.5c.621 0 1.125-.504 1.125-1.125v-.75c0-.621-.504-1.125-1.125-1.125h-1.5m-12.75 0h12.75c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125H3.375z" />
              </svg>
              <p className="text-slate-400 text-sm font-medium">No hay reservas para el filtro seleccionado</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 text-center">
          <Link href="/dashboard/appointments" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
            Ver gestión completa de citas →
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── SKELETON ─── */
function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div><div className="h-8 bg-slate-200 rounded w-48 mb-2" /><div className="h-4 bg-slate-200 rounded w-64" /></div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-200 rounded-2xl" />)}
      </div>
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  )
}

/* ─── MAIN EXPORT ─── */
export default function DashboardPage() {
  const { api, user } = useAuth()

  if (!user) return <DashboardSkeleton />

  const role = user.role

  if (role === ROLES.ADMIN) return <AdminDashboard api={api} />
  if (role === ROLES.DENTIST) return <DentistDashboard api={api} user={user} />
  if (role === ROLES.RECEPTIONIST) return <ReceptionistDashboard api={api} />

  return <AdminDashboard api={api} />
}
