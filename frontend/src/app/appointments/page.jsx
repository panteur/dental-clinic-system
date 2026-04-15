'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AppointmentPage() {
  const { api } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [dentists, setDentists] = useState([])
  const [services, setServices] = useState([])
  const [selectedDentist, setSelectedDentist] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  
  const [patientData, setPatientData] = useState({
    dni: '',
    name: '',
    last_name: '',
    phone: '',
    email: ''
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedDentist && selectedDate) {
      loadSlots()
    }
  }, [selectedDentist, selectedDate])

  const loadInitialData = async () => {
    try {
      const [servicesRes, dentistsRes] = await Promise.all([
        api.get('/public/services'),
        api.get('/public/dentists')
      ])
      setServices(servicesRes.data.services)
      setDentists(dentistsRes.data.dentists)
    } catch (err) {
      console.error('Error loading data:', err)
    }
  }

  const loadSlots = async () => {
    setLoadingSlots(true)
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const res = await api.get(`/public/slots?dentist_id=${selectedDentist}&date=${dateStr}`)
      setAvailableSlots(res.data.slots)
    } catch (err) {
      console.error('Error loading slots:', err)
      setAvailableSlots([])
    }
    setLoadingSlots(false)
  }

  const handlePatientChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      await api.post('/public/appointment', {
        ...patientData,
        dentist_id: selectedDentist,
        service_id: selectedService,
        date: dateStr,
        time: selectedTime
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agendar la cita')
    }
    setSubmitting(false)
  }

  const nextDate = addDays(new Date(), 1)
  const maxDate = addDays(new Date(), 60)
  
  const dates = []
  for (let i = 0; i < 14; i++) {
    const d = addDays(nextDate, i)
    if (d.getDay() !== 0) {
      dates.push(d)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cita Agendada!</h2>
          <p className="text-gray-600 mb-6">
            Su cita ha sido agendada exitosamente. Nos pondremos en contacto con usted para confirmar los detalles.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p><strong>Fecha:</strong> {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}</p>
            <p><strong>Hora:</strong> {selectedTime}</p>
            <p><strong>Servicio:</strong> {services.find(s => s.id == selectedService)?.name}</p>
            <p><strong>Dentista:</strong> {dentists.find(d => d.id == selectedDentist)?.name}</p>
          </div>
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">DentalCare</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Dentist & Service */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Seleccione dentista y servicio</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dentista</label>
              <div className="grid md:grid-cols-2 gap-4">
                {dentists.map((dentist) => (
                  <div
                    key={dentist.id}
                    onClick={() => setSelectedDentist(dentist.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedDentist === dentist.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{dentist.name}</p>
                        <p className="text-sm text-gray-500">{dentist.specialty}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Servicio</label>
              <div className="grid md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedService === service.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500">Duración: {service.duration} min</p>
                    <p className="text-primary-600 font-medium">${parseFloat(service.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => selectedDentist && selectedService && setStep(2)}
              disabled={!selectedDentist || !selectedService}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Seleccione fecha y hora</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {dates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date)
                      setSelectedTime(null)
                    }}
                    className={`p-3 rounded-lg text-center transition ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className="text-xs uppercase">{format(date, 'EEE', { locale: es })}</p>
                    <p className="text-lg font-bold">{format(date, 'd')}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario disponible {loadingSlots && '(Cargando...)'}
                </label>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 rounded-lg text-center transition ${
                          selectedTime === slot
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
                    {loadingSlots ? 'Cargando horarios...' : 'No hay horarios disponibles para este día'}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition"
              >
                Atrás
              </button>
              <button
                onClick={() => selectedDate && selectedTime && setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Patient Data */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sus datos de contacto</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUN/DNI *
                  </label>
                  <input
                    type="text"
                    name="dni"
                    required
                    value={patientData.dni}
                    onChange={handlePatientChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="12.345.678-9"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={patientData.phone}
                    onChange={handlePatientChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={patientData.name}
                    onChange={handlePatientChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    value={patientData.last_name}
                    onChange={handlePatientChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Pérez"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico (opcional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={patientData.email}
                  onChange={handlePatientChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="juan@email.com"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Resumen de su cita:</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Dentista:</strong> {dentists.find(d => d.id == selectedDentist)?.name}</p>
                  <p><strong>Servicio:</strong> {services.find(s => s.id == selectedService)?.name}</p>
                  <p><strong>Fecha:</strong> {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}</p>
                  <p><strong>Hora:</strong> {selectedTime}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition disabled:cursor-not-allowed"
                >
                  {submitting ? 'Agendando...' : 'Confirmar Cita'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
