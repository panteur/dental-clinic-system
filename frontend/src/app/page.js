'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

const services = [
  {
    title: 'Odontología General',
    description: 'Revisiones completas, limpiezas y tratamientos preventivos para mantener tu salud bucal en óptimas condiciones.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Estética Dental',
    description: 'Blanqueamiento, carillas y diseño de sonrisa para lograr la apariencia perfecta.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: 'Ortodoncia',
    description: 'Brackets y alineadores transparentes para corregir tu mordida y alinear tu sonrisa.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
]

const stats = [
  { value: '15+', label: 'Años de experiencia' },
  { value: '10K+', label: 'Pacientes atendidos' },
  { value: '98%', label: 'Satisfacción' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFormStatus({ type: '', message: '' })
    
    try {
      const res = await fetch(`${API_URL}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setFormStatus({ type: 'success', message: '¡Gracias! Te contactaremos pronto.' })
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        setFormStatus({ type: 'error', message: 'Error al enviar. Intenta de nuevo.' })
      }
    } catch {
      setFormStatus({ type: 'error', message: 'Sin conexión. Verifica tu red.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-lg font-medium tracking-tight">DentalCare</span>
            </Link>
            <div className="hidden md:flex items-center gap-10">
              <a href="#servicios" className="text-sm text-white/60 hover:text-white transition-colors">Servicios</a>
              <a href="#nosotros" className="text-sm text-white/60 hover:text-white transition-colors">Nosotros</a>
              <a href="#contacto" className="text-sm text-white/60 hover:text-white transition-colors">Contacto</a>
              <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">Acceder</Link>
              <Link href="/appointments" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                Agendar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-neutral-800 rounded-full blur-[200px] opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-neutral-700 rounded-full blur-[150px] opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-white/60">Citas disponibles esta semana</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 leading-[1.1]">
              Excelencia<br />
              <span className="text-white/40">en cada sonrisa</span>
            </h1>
            
            <p className="text-lg text-white/50 max-w-xl mb-12 leading-relaxed">
              Clínica dental con más de 15 años de experiencia. Combinamos tecnología de vanguardia con un trato personalizado para cuidar tu salud bucal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/appointments" className="bg-white text-black px-8 py-4 rounded-full text-sm font-medium hover:bg-white/90 transition-all text-center">
                Agendar cita
              </Link>
              <a href="#servicios" className="border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/5 transition-all text-center">
                Ver servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-light tracking-tight mb-2">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-20">
            <p className="text-sm text-white/40 uppercase tracking-widest mb-4">Servicios</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">Lo que ofrecemos</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {services.map((service, i) => (
              <div key={i} className="bg-[#0a0a0a] p-10 hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center text-white/60 group-hover:border-white/20 group-hover:text-white transition-colors mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{service.title}</h3>
                <p className="text-white/40 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="nosotros" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-widest mb-4">Nosotros</p>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8 leading-tight">
                Cuidando sonrisas<br />
                <span className="text-white/40">desde 2010</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                En DentalCare creemos que cada sonrisa es única. Nuestro equipo de profesionales altamente capacitados se compromete a brindarte una experiencia excepcional, combinando técnicas modernas con un trato cálido y personalizado.
              </p>
              <p className="text-white/50 leading-relaxed mb-10">
                Contamos con instalaciones de última generación y-utilizamos materiales de la más alta calidad para garantizar resultados óptimos y duraderos.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-light mb-1">24/7</p>
                  <p className="text-sm text-white/40">Soporte</p>
                </div>
                <div>
                  <p className="text-2xl font-light mb-1">5</p>
                  <p className="text-sm text-white/40">Especialistas</p>
                </div>
                <div>
                  <p className="text-2xl font-light mb-1">100%</p>
                  <p className="text-sm text-white/40">Sterilizado</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=1000&fit=crop')] bg-cover bg-center opacity-60"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-neutral-800 rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-neutral-900 rounded-3xl p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Primera consulta<br /><span className="text-white/40">gratuita</span></h2>
              <p className="text-white/50 mb-10 max-w-lg">
                Agenda tu primera visita sin compromiso. Conoceremos tus necesidades y te explicaremos las mejores opciones para tu caso.
              </p>
              <Link href="/appointments" className="inline-block bg-white text-black px-8 py-4 rounded-full text-sm font-medium hover:bg-white/90 transition-all">
                Reservar ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-sm text-white/40 uppercase tracking-widest mb-4">Contacto</p>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">Hablemos</h2>
              <p className="text-white/50 mb-12 max-w-md">
                ¿Tienes preguntas o quieres agendar una cita? Estamos aquí para ayudarte.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/40">Teléfono</p>
                    <p className="text-white">+52 55 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/40">Email</p>
                    <p className="text-white">contacto@dentalcare.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white/40">Ubicación</p>
                    <p className="text-white">Av. Reforma 500, CDMX</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Teléfono"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-colors resize-none"
                    placeholder="Mensaje"
                  />
                </div>
                
                {formStatus.message && (
                  <div className={`p-4 rounded-xl ${formStatus.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {formStatus.message}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm">DentalCare</span>
            </div>
            <p className="text-sm text-white/30">© 2024 DentalCare. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
