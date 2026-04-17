'use client'

import StatisticsDashboard from '@/components/StatisticsDashboard'

export default function StatisticsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Estadísticas</h1>
        <p className="text-slate-500 mt-1">Reportes, métricas y exportación de datos</p>
      </div>

      <StatisticsDashboard />
    </div>
  )
}
