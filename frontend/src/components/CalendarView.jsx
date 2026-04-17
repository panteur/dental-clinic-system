'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfWeek as getStartOfWeek
} from 'date-fns'
import { es } from 'date-fns/locale'

const STATUS_COLORS = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmada: 'bg-blue-100 text-blue-800 border-blue-300',
  completada: 'bg-green-100 text-green-800 border-green-300',
  cancelada: 'bg-red-100 text-red-800 border-red-300',
  no_presento: 'bg-gray-100 text-gray-600 border-gray-300'
}

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
  no_presento: 'No presentó'
}

export default function CalendarView({ onAppointmentClick }) {
  const { api, user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('month')
  const [selectedDentist, setSelectedDentist] = useState('all')
  const [dentists, setDentists] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [dayAppointments, setDayAppointments] = useState([])

  useEffect(() => {
    loadDentists()
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [currentDate, view, selectedDentist])

  useEffect(() => {
    if (selectedDay) {
      const dayAppts = appointments.filter(apt => 
        isSameDay(new Date(apt.date), selectedDay)
      )
      setDayAppointments(dayAppts)
    }
  }, [selectedDay, appointments])

  const loadDentists = async () => {
    try {
      const res = await api.get('/users/dentists')
      setDentists(res.data.dentists || [])
    } catch (err) {
      console.error('Error loading dentists:', err)
    }
  }

  const loadAppointments = async () => {
    setLoading(true)
    try {
      let startDate, endDate

      if (view === 'month') {
        startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
        endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd')
      } else {
        const weekStart = getStartOfWeek(currentDate, { weekStartsOn: 1 })
        startDate = format(weekStart, 'yyyy-MM-dd')
        endDate = format(addWeeks(weekStart, 1), 'yyyy-MM-dd')
      }

      let url = `/appointments/by-range?start_date=${startDate}&end_date=${endDate}`
      if (selectedDentist !== 'all' && user?.role === 'admin') {
        url += `&dentist_id=${selectedDentist}`
      } else if (user?.role === 'dentista') {
        url += `&dentist_id=${user.id}`
      }

      const res = await api.get(url)
      setAppointments(res.data.appointments || [])
    } catch (err) {
      console.error('Error loading appointments:', err)
    }
    setLoading(false)
  }

  const getAppointmentsForDay = (day) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), day))
  }

  const navigatePrev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDay(new Date())
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {weekDays.map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center text-xs font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const dayAppts = getAppointmentsForDay(day)
          const isToday = isSameDay(day, new Date())
          const isSelected = selectedDay && isSameDay(day, selectedDay)
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={idx}
              onClick={() => setSelectedDay(day)}
              className={`bg-white min-h-[80px] p-1 cursor-pointer transition-colors ${
                isSelected ? 'ring-2 ring-sky-500 ring-inset' : 'hover:bg-gray-50'
              } ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
            >
              <div className={`text-xs font-semibold p-1 rounded-full w-7 h-7 flex items-center justify-center mx-auto ${
                isToday ? 'bg-sky-600 text-white' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="mt-1 space-y-0.5">
                {dayAppts.slice(0, 3).map(apt => (
                  <div
                    key={apt.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onAppointmentClick?.(apt)
                    }}
                    className={`text-[10px] px-1 py-0.5 rounded truncate ${STATUS_COLORS[apt.status] || 'bg-gray-100'} ${
                      apt.status === 'cancelada' ? 'line-through opacity-50' : ''
                    }`}
                    title={`${apt.time} - ${apt.patient_name} ${apt.patient_last_name}`}
                  >
                    {apt.time} {apt.patient_name}
                  </div>
                ))}
                {dayAppts.length > 3 && (
                  <div className="text-[10px] text-gray-500 text-center">+{dayAppts.length - 3} más</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = getStartOfWeek(currentDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: weekStart, end: addWeeks(weekStart, 1).setDate(weekStart.getDate() - 1) })
    const hours = Array.from({ length: 12 }, (_, i) => i + 7)

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-2 text-xs font-semibold text-gray-500"></div>
            {days.map((day, idx) => (
              <div key={idx} className={`p-2 text-center ${isSameDay(day, new Date()) ? 'bg-sky-50' : ''}`}>
                <div className="text-xs font-semibold text-gray-600">{format(day, 'EEE', { locale: es })}</div>
                <div className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-sky-600' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          <div className="divide-y divide-gray-100">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8">
                <div className="p-2 text-xs text-gray-500 border-r border-gray-100">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {days.map((day, idx) => {
                  const dayAppts = getAppointmentsForDay(day).filter(apt => {
                    const aptHour = parseInt(apt.time.split(':')[0])
                    return aptHour === hour
                  })
                  return (
                    <div key={idx} className={`p-1 border-r border-gray-100 min-h-[50px] ${isSameDay(day, new Date()) ? 'bg-sky-50/50' : ''}`}>
                      {dayAppts.map(apt => (
                        <div
                          key={apt.id}
                          onClick={() => onAppointmentClick?.(apt)}
                          className={`text-[10px] px-1 py-0.5 rounded cursor-pointer mb-0.5 ${STATUS_COLORS[apt.status] || 'bg-gray-100'} ${
                            apt.status === 'cancelada' ? 'line-through opacity-50' : ''
                          }`}
                        >
                          {apt.time} {apt.patient_name}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={navigatePrev} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
            {view === 'month' 
              ? format(currentDate, 'MMMM yyyy', { locale: es }).replace(/^\w/, c => c.toUpperCase())
              : `Semana del ${format(getStartOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: es })}`
            }
          </h3>
          <button onClick={navigateNext} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={goToToday} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
            Hoy
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDentist}
            onChange={(e) => setSelectedDentist(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos los dentistas</option>
            {dentists.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                view === 'month' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                view === 'week' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {view === 'month' ? renderMonthView() : renderWeekView()}

          {selectedDay && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Citas del {format(selectedDay, "d 'de' MMMM 'de' yyyy", { locale: es })}
              </h4>
              {dayAppointments.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay citas para este día</p>
              ) : (
                <div className="space-y-2">
                  {dayAppointments.map(apt => (
                    <div
                      key={apt.id}
                      onClick={() => onAppointmentClick?.(apt)}
                      className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition ${
                        STATUS_COLORS[apt.status] || 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {apt.patient_name} {apt.patient_last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {apt.time} - {apt.service_name || 'Consulta'}
                          </p>
                          <p className="text-xs text-gray-500">{apt.dentist_name}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[apt.status] || 'bg-gray-100'
                        }`}>
                          {STATUS_LABELS[apt.status] || apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
