'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function ServicesPage() {
  const { api, user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const res = await api.get('/services')
      setServices(res.data.services || [])
    } catch (err) {
      console.error('Error loading services:', err)
    }
    setLoading(false)
  }

  const toggleActive = async (id) => {
    try {
      await api.patch(`/services/${id}/toggle`)
      loadServices()
    } catch (err) {
      console.error('Error toggling service:', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
      </div>

      {/* Services Grid */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className={`p-4 border rounded-lg transition ${
                    service.active ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      service.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {service.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary-600 font-bold">${parseFloat(service.price).toFixed(2)}</span>
                    <span className="text-gray-500">{service.duration} min</span>
                  </div>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => toggleActive(service.id)}
                      className="mt-3 w-full text-sm text-gray-600 hover:text-gray-900 py-2 border rounded hover:bg-gray-100 transition"
                    >
                      {service.active ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
