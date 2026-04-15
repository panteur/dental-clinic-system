'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const services = [
  {
    title: 'Odontología General',
    description: 'Revisiones completas, limpiezas y tratamientos preventivos para mantener tu salud bucal en óptimas condiciones.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop'
  },
  {
    title: 'Estética Dental',
    description: 'Blanqueamiento, carillas y diseño de sonrisa para lograr la apariencia perfecta que siempre has querido.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop'
  },
  {
    title: 'Ortodoncia',
    description: '矫正装置 tradicionales y alineadores transparentes para corregir tu mordida y alinear tu sonrisa.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop'
  }
]

const team = [
  { name: 'Dra. María González', specialty: 'Odontología General', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face' },
  { name: 'Dr. Carlos Rodríguez', specialty: 'Ortodoncia', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face' },
  { name: 'Dra. Ana Martínez', specialty: 'Estética Dental', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face' },
]

const testimonials = [
  { name: 'Laura Mendoza', text: 'Mejor experiencia dental que he tenido. El trato es excepcional y los resultados superan mis expectativas.', rating: 5 },
  { name: 'Roberto Sánchez', text: 'Profesionalismo y calidez en cada visita. Mi familia entera ahora viene aquí.', rating: 5 },
  { name: 'Carmen López', text: 'El proceso de agendamiento en línea es súper práctico. Definitivamente recomiendo.', rating: 5 },
]

const certifications = [
  { name: 'ISO 9001', desc: 'Calidad garantizada' },
  { name: 'ADA', desc: 'Asociación Dental Americana' },
  { name: 'Certificación Local', desc: 'Reguladores de salud' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5B8A72] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className={`text-xl font-medium ${scrolled ? 'text-gray-900' : 'text-gray-800'}`}>DentalCare</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#servicios" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-[#5B8A72]' : 'text-gray-700 hover:text-[#5B8A72]'}`}>Servicios</a>
              <a href="#equipo" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-[#5B8A72]' : 'text-gray-700 hover:text-[#5B8A72]'}`}>Nuestro Equipo</a>
              <a href="#testimonios" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-[#5B8A72]' : 'text-gray-700 hover:text-[#5B8A72]'}`}>Testimonios</a>
              <Link href="/login" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-[#5B8A72]' : 'text-gray-700 hover:text-[#5B8A72]'}`}>Iniciar Sesión</Link>
              <Link href="/appointments" className="bg-[#5B8A72] hover:bg-[#4a7560] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                Agendar Cita
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8DDD4]/50 via-[#FDFBF7] to-[#FDFBF7]"></div>
        <div className="absolute top-20 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1629909615184-74f495363b67?w=1200&h=800&fit=crop')] bg-cover bg-center opacity-20 lg:opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <span className="inline-block text-[#5B8A72] text-sm font-medium tracking-wider uppercase mb-4">Bienvenido a DentalCare</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 leading-tight mb-6">
              Donde tu <span className="text-[#5B8A72]">sonrisa</span> renace
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Experimenta el cuidado dental como nunca antes. Combinamos tecnología de vanguardia con un trato cálido y personalizado para hacerte sentir cómodo en cada visita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/appointments" className="bg-[#5B8A72] hover:bg-[#4a7560] text-white px-8 py-4 rounded-full text-base font-medium transition-all hover:shadow-lg">
                Agenda tu Cita
              </Link>
              <a href="#servicios" className="border-2 border-gray-300 text-gray-700 hover:border-[#5B8A72] hover:text-[#5B8A72] px-8 py-4 rounded-full text-base font-medium transition-all">
                Descubrir Servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8DDD4] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#5B8A72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#5B8A72] text-sm font-medium tracking-wider uppercase">Lo que ofrecemos</span>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mt-3 mb-4">Nuestros Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Cada tratamiento está diseñado para brindarte la mejor experiencia y resultados excepcionales.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="w-14 h-14 bg-[#5B8A72]/10 rounded-xl flex items-center justify-center text-[#5B8A72] mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="equipo" className="py-24 px-6 lg:px-8 bg-[#E8DDD4]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#5B8A72] text-sm font-medium tracking-wider uppercase">Conoce a los expertos</span>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mt-3 mb-4">Nuestro Equipo</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Profesionales comprometidos con tu bienestar y tu sonrisa.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">{member.name}</h3>
                <p className="text-[#5B8A72]">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-24 px-6 lg:px-8 bg-[#5B8A72]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#C4A77D] text-sm font-medium tracking-wider uppercase">Testimonios</span>
          <h2 className="text-4xl md:text-5xl font-medium text-white mt-3 mb-12">Lo que dicen nuestros pacientes</h2>
          
          <div className="relative min-h-[200px]">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i}
                className={`absolute inset-0 transition-opacity duration-500 ${i === activeTestimonial ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-[#C4A77D]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-white/90 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                <p className="text-[#C4A77D] font-medium">{testimonial.name}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button 
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeTestimonial ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#5B8A72] to-[#4a7560] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">Tu primera consulta es gratuita</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">Agenda tu primera cita sin compromiso y descubre cómo podemos transformar tu sonrisa.</p>
              <Link href="/appointments" className="inline-block bg-white text-[#5B8A72] hover:bg-gray-100 px-8 py-4 rounded-full text-base font-medium transition-all hover:shadow-lg">
                Reservar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#5B8A72] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xl font-medium text-white">DentalCare</span>
              </div>
              <p className="text-sm leading-relaxed max-w-md">Cuidando sonrisas desde 2010. Nuestro compromiso es brindarte la mejor experiencia dental con un equipo apasionado y tecnología de vanguardia.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Horario</h4>
              <ul className="space-y-2 text-sm">
                <li>Lunes - Viernes: 9:00 - 19:00</li>
                <li>Sábados: 9:00 - 14:00</li>
                <li>Domingos: Cerrado</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>+52 55 1234 5678</li>
                <li>contacto@dentalcare.com</li>
                <li>Av. Reforma 500, CDMX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 DentalCare. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
