'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function StatisticsDashboard() {
  const { api, user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [dateRange, setDateRange] = useState({ start: null, end: null })

  useEffect(() => {
    const now = new Date()
    if (period === 'month') {
      setDateRange({
        start: format(startOfMonth(now), 'yyyy-MM-dd'),
        end: format(endOfMonth(now), 'yyyy-MM-dd')
      })
    } else if (period === 'week') {
      setDateRange({
        start: format(subDays(now, 7), 'yyyy-MM-dd'),
        end: format(now, 'yyyy-MM-dd')
      })
    } else if (period === 'year') {
      setDateRange({
        start: format(subMonths(startOfMonth(now), 11), 'yyyy-MM-dd'),
        end: format(now, 'yyyy-MM-dd')
      })
    }
  }, [period])

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      loadStatistics()
    }
  }, [dateRange, user])

  const loadStatistics = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/appointments/by-range?start=${dateRange.start}&end=${dateRange.end}`)
      const appointments = res.data.appointments || []

      const totalAppointments = appointments.length
      const completedAppointments = appointments.filter(a => a.status === 'completada').length
      const cancelledAppointments = appointments.filter(a => a.status === 'cancelada').length
      const pendingAppointments = appointments.filter(a => a.status === 'pendiente').length
      const confirmedAppointments = appointments.filter(a => a.status === 'confirmada').length
      const noShowAppointments = appointments.filter(a => a.status === 'no_presento').length

      const completionRate = totalAppointments > 0 
        ? ((completedAppointments / totalAppointments) * 100).toFixed(1) 
        : 0
      const cancellationRate = totalAppointments > 0 
        ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1) 
        : 0

      const appointmentsByStatus = {
        pendiente: pendingAppointments,
        confirmada: confirmedAppointments,
        completada: completedAppointments,
        cancelada: cancelledAppointments,
        no_presento: noShowAppointments
      }

      const appointmentsByService = appointments.reduce((acc, apt) => {
        const service = apt.service_name || 'Sin servicio'
        acc[service] = (acc[service] || 0) + 1
        return acc
      }, {})

      const appointmentsByDentist = appointments.reduce((acc, apt) => {
        const dentist = apt.dentist_name || 'Sin dentista'
        acc[dentist] = (acc[dentist] || 0) + 1
        return acc
      }, {})

      const totalRevenue = appointments
        .filter(a => a.status === 'completada')
        .reduce((sum, a) => sum + (parseFloat(a.service_price) || 0), 0)

      const appointmentsByDay = {}
      appointments.forEach(apt => {
        const day = format(new Date(apt.date), 'yyyy-MM-dd')
        appointmentsByDay[day] = (appointmentsByDay[day] || 0) + 1
      })

      const uniquePatients = [...new Set(appointments.map(a => a.patient_id))].length
      const newPatients = appointments.filter(a => a.type === 'nueva').length
      const followUps = appointments.filter(a => a.type === 'seguimiento').length

      setStats({
        total: totalAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        noShow: noShowAppointments,
        completionRate,
        cancellationRate,
        byStatus: appointmentsByStatus,
        byService: appointmentsByService,
        byDentist: appointmentsByDentist,
        totalRevenue,
        byDay: appointmentsByDay,
        uniquePatients,
        newPatients,
        followUps
      })
    } catch (err) {
      console.error('Error loading statistics:', err)
    }
    setLoading(false)
  }

  const exportToExcel = () => {
    if (!stats) return

    const appointmentsData = [
      ['Estadísticas del período'],
      [`Desde: ${dateRange.start}`],
      [`Hasta: ${dateRange.end}`],
      [],
      ['Resumen General'],
      ['Métricas', 'Valor'],
      ['Total de citas', stats.total],
      ['Citas completadas', stats.completed],
      ['Citas canceladas', stats.cancelled],
      ['Citas pendientes', stats.pending],
      ['Citas confirmadas', stats.confirmed],
      ['Tasa de completación (%)', stats.completionRate],
      ['Tasa de cancelación (%)', stats.cancellationRate],
      ['Ingresos totales ($)', stats.totalRevenue.toFixed(2)],
      ['Pacientes únicos', stats.uniquePatients],
      ['Nuevos pacientes', stats.newPatients],
      [],
      ['Citas por servicio'],
      ['Servicio', 'Cantidad'],
      ...Object.entries(stats.byService),
      [],
      ['Citas por dentista'],
      ['Dentista', 'Cantidad'],
      ...Object.entries(stats.byDentist),
      [],
      ['Citas por estado'],
      ['Estado', 'Cantidad'],
      ...Object.entries(stats.byStatus)
    ]

    const ws = XLSX.utils.aoa_to_sheet(appointmentsData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas')
    XLSX.writeFile(wb, `estadisticas-clinica-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
  }

  const exportToPDF = () => {
    if (!stats) return

    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Reporte de Estadisticas - Clinica Dental', 14, 22)

    doc.setFontSize(10)
    doc.text(`Periodo: ${dateRange.start} al ${dateRange.end}`, 14, 30)
    doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 36)

    doc.setFontSize(14)
    doc.text('Resumen General', 14, 48)

    doc.setFontSize(10)
    const summaryData = [
      ['Total de citas', stats.total.toString()],
      ['Completadas', stats.completed.toString()],
      ['Canceladas', stats.cancelled.toString()],
      ['Pendientes', stats.pending.toString()],
      ['Confirmadas', stats.confirmed.toString()],
      ['No se presentaron', stats.noShow.toString()],
      ['Tasa de completacion (%)', stats.completionRate],
      ['Tasa de cancelacion (%)', stats.cancellationRate],
      ['Ingresos totales', `$${stats.totalRevenue.toFixed(2)}`],
      ['Pacientes unicos', stats.uniquePatients.toString()],
      ['Nuevos pacientes', stats.newPatients.toString()]
    ]

    doc.autoTable({
      startY: 52,
      head: [['Metrica', 'Valor']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [15, 76, 117] }
    })

    const yPos = doc.lastAutoTable.finalY + 10

    doc.setFontSize(14)
    doc.text('Citas por Servicio', 14, yPos)

    const serviceData = Object.entries(stats.byService).map(([name, count]) => [name, count.toString()])
    doc.autoTable({
      startY: yPos + 4,
      head: [['Servicio', 'Cantidad']],
      body: serviceData,
      theme: 'striped',
      headStyles: { fillColor: [15, 76, 117] }
    })

    const yPos2 = doc.lastAutoTable.finalY + 10

    doc.setFontSize(14)
    doc.text('Citas por Dentista', 14, yPos2)

    const dentistData = Object.entries(stats.byDentist).map(([name, count]) => [name, count.toString()])
    doc.autoTable({
      startY: yPos2 + 4,
      head: [['Dentista', 'Cantidad']],
      body: dentistData,
      theme: 'striped',
      headStyles: { fillColor: [15, 76, 117] }
    })

    doc.save(`reporte-clinica-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!stats) {
    return <p className="text-gray-500">No hay datos disponibles</p>
  }

  const periodLabels = {
    week: 'Ultimos 7 dias',
    month: 'Este mes',
    year: 'Ultimos 12 meses'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Estadisticas</h3>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Ultimos 7 dias</option>
            <option value="month">Este mes</option>
            <option value="year">Ultimos 12 meses</option>
          </select>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total de citas</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Completadas</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Canceladas</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Tasa completacion</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.completionRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Ingresos</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${stats.totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Citas por Servicio</h4>
          <div className="space-y-3">
            {Object.entries(stats.byService)
              .sort((a, b) => b[1] - a[1])
              .map(([service, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                return (
                  <div key={service}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{service}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-sky-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Citas por Dentista</h4>
          <div className="space-y-3">
            {Object.entries(stats.byDentist)
              .sort((a, b) => b[1] - a[1])
              .map(([dentist, count]) => {
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                return (
                  <div key={dentist}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{dentist}</span>
                      <span className="font-medium text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Pacientes unicos</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{stats.uniquePatients}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Nuevos pacientes</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.newPatients}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Seguimientos</p>
          <p className="text-3xl font-bold text-teal-600 mt-1">{stats.followUps}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-500">No se presentaron</p>
          <p className="text-3xl font-bold text-gray-600 mt-1">{stats.noShow}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Estado de las citas</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const colors = {
              pendiente: 'bg-yellow-100 text-yellow-800',
              confirmada: 'bg-blue-100 text-blue-800',
              completada: 'bg-green-100 text-green-800',
              cancelada: 'bg-red-100 text-red-800',
              no_presento: 'bg-gray-100 text-gray-800'
            }
            const labels = {
              pendiente: 'Pendiente',
              confirmada: 'Confirmada',
              completada: 'Completada',
              cancelada: 'Cancelada',
              no_presento: 'No presento'
            }
            return (
              <div key={status} className={`rounded-lg p-4 text-center ${colors[status]}`}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs mt-1">{labels[status]}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
