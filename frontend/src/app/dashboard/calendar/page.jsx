'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import CalendarView from '@/components/CalendarView'

function AppointmentDetailModal({ apt, onClose, onCancel, onReschedule }) {
  if (!apt) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Detalle de Cita</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Paciente</p>
              <p className="font-medium text-slate-900">{apt.patient_name} {apt.patient_last_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Servicio</p>
              <p className="font-medium text-slate-900">{apt.service_name || 'Consulta'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Fecha</p>
              <p className="font-medium text-slate-900">
                {format(new Date(apt.date), "d 'de' MMMM yyyy", { locale: es })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Hora</p>
              <p className="font-medium text-slate-900">{apt.time?.substring(0, 5)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Dentista</p>
              <p className="font-medium text-slate-900">{apt.dentist_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Estado</p>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                apt.status === 'completada' ? 'bg-green-100 text-green-800 border-green-200' :
                apt.status === 'cancelada' ? 'bg-red-100 text-red-800 border-red-200' :
                apt.status === 'confirmada' ? 'bg-green-100 text-green-800 border-green-200' :
                apt.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {apt.status === 'completada' ? 'Completada' :
                 apt.status === 'cancelada' ? 'Cancelada' :
                 apt.status === 'confirmada' ? 'Confirmada' :
                 apt.status === 'pendiente' ? 'Pendiente' :
                 'No se presentó'}
              </span>
            </div>
            {apt.patient_phone && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                <p className="font-medium text-slate-900">{apt.patient_phone}</p>
              </div>
            )}
            {apt.notes && (
              <div className="col-span-2">
                <p className="text-xs text-slate-500 mb-1">Notas</p>
                <p className="text-sm text-slate-700">{apt.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          {apt.status !== 'cancelada' && apt.status !== 'completada' && (
            <>
              <button
                onClick={() => onReschedule(apt)}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors"
              >
                Reagendar
              </button>
              <button
                onClick={() => onCancel(apt)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Anular
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const { api } = useAuth()
  const [selectedApt, setSelectedApt] = useState(null)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Calendario de Citas</h1>
        <p className="text-slate-500 mt-1">Vista mensual y semanal de todas las citas</p>
      </div>

      <CalendarView onAppointmentClick={setSelectedApt} />

      {selectedApt && (
        <AppointmentDetailModal
          apt={selectedApt}
          onClose={() => setSelectedApt(null)}
          onCancel={(apt) => {
            alert(`Anular cita: ${apt.id}`)
            setSelectedApt(null)
          }}
          onReschedule={(apt) => {
            alert(`Reagendar cita: ${apt.id}`)
            setSelectedApt(null)
          }}
        />
      )}
    </div>
  )
}
