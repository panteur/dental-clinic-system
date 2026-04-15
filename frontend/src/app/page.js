 'use client'

 import { useState, useEffect } from 'react'
 import Link from 'next/link'

 const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

 const services = [
   {
     title: 'Limpieza y Prevención',
     description: 'Profilaxis y educación para mantener tu salud bucal en óptimas condiciones.',
     icon: (
       <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2C8 2 6 5 6 8c0 3 2 6 6 12 4-6 6-9 6-12 0-3-2-6-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
     )
   },
   {
     title: 'Estética y Rehabilitación',
     description: 'Blanqueamientos, carillas y restauraciones estéticas para una sonrisa natural.',
     icon: (
       <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
     )
   },
   {
     title: 'Ortodoncia y Alineadores',
     description: 'Opciones removibles y fijas para alinear dientes con discreción y eficacia.',
     icon: (
       <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
     )
   }
 ]

 const stats = [
   { value: '15+', label: 'Años de experiencia' },
   { value: '10.000+', label: 'Pacientes atendidos' },
   { value: '4.9/5', label: 'Valoración promedio' },
 ]

 export default function HomePage() {
   const [scrolled, setScrolled] = useState(false)
   const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
   const [formStatus, setFormStatus] = useState({ type: '', message: '' })
   const [loading, setLoading] = useState(false)

   useEffect(() => {
     const handleScroll = () => setScrolled(window.scrollY > 16)
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
         setFormStatus({ type: 'success', message: 'Gracias — recibimos tu mensaje. Te contactamos pronto.' })
         setFormData({ name: '', email: '', phone: '', message: '' })
       } else {
         setFormStatus({ type: 'error', message: 'Ocurrió un error al enviar. Intenta nuevamente más tarde.' })
       }
     } catch (err) {
       setFormStatus({ type: 'error', message: 'Error de red. Verifica tu conexión.' })
     } finally {
       setLoading(false)
     }
   }

   return (
     <div className="min-h-screen bg-white text-slate-900 antialiased">
       {/* Navbar */}
       <nav className={`fixed top-0 inset-x-0 z-50 bg-white transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="flex items-center justify-between h-20">
             <Link href="/" className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-tr from-sky-700 to-blue-600 rounded-lg flex items-center justify-center">
                 <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 2C8 2 6 5 6 8c0 3 2 6 6 12 4-6 6-9 6-12 0-3-2-6-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
               <span className="text-lg font-semibold">DentalCare</span>
             </Link>

             <div className="hidden md:flex items-center gap-8">
               <a href="#servicios" className="text-sm text-slate-600 hover:text-slate-900">Servicios</a>
               <a href="#nosotros" className="text-sm text-slate-600 hover:text-slate-900">Nosotros</a>
               <a href="#contacto" className="text-sm text-slate-600 hover:text-slate-900">Contacto</a>
               <Link href="/appointments" className="inline-flex items-center gap-3 bg-sky-700 hover:bg-sky-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"> 
                 Agendar cita
               </Link>
             </div>
           </div>
         </div>
       </nav>

       {/* Hero */}
       <header className="pt-28 pb-16">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
             <div className="lg:col-span-6">
               <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-sm mb-6">
                 <span className="w-2 h-2 bg-sky-700 rounded-full" /> Disponibilidad esta semana
               </p>
               <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">Salud oral profesional, resultados confiables</h1>
               <p className="text-lg text-slate-600 mb-6">Atención integral con especialistas certificados. Tecnología digital y protocolos de esterilización estrictos para tu tranquilidad.</p>

               <div className="flex flex-wrap gap-4">
                 <Link href="/appointments" className="inline-block bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-lg font-medium transition">Agendar cita</Link>
                 <a href="#servicios" className="inline-block border border-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50 transition">Ver servicios</a>
               </div>

               <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                 {stats.map((s, i) => (
                   <div key={i} className="text-center">
                     <p className="text-2xl font-semibold text-sky-700">{s.value}</p>
                     <p className="text-xs text-slate-500">{s.label}</p>
                   </div>
                 ))}
               </div>
             </div>

             <div className="lg:col-span-6">
               <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                 <img src="https://images.unsplash.com/photo-1588774069165-8e2f7b0d980b?w=1200&q=80&auto=format&fit=crop" alt="Clínica dental" className="w-full h-72 object-cover md:h-96" />
               </div>
             </div>
           </div>
         </div>
       </header>

       {/* Services */}
       <section id="servicios" className="py-16 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="text-center max-w-2xl mx-auto mb-12">
             <h2 className="text-3xl font-semibold text-slate-900">Servicios</h2>
             <p className="text-slate-600 mt-2">Tratamientos personalizados con enfoque conservador y estético.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
             {services.map((svc, i) => (
               <div key={i} className="bg-white rounded-2xl p-6 border border-slate-50 shadow-sm hover:shadow-md transition">
                 <div className="w-12 h-12 mb-4 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">{svc.icon}</div>
                 <h3 className="text-lg font-semibold text-slate-900 mb-2">{svc.title}</h3>
                 <p className="text-slate-600 text-sm">{svc.description}</p>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* Why choose us */}
       <section className="py-16 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="grid md:grid-cols-3 gap-6 items-center">
             <div className="md:col-span-2">
               <h3 className="text-2xl font-semibold text-slate-900 mb-4">Por qué elegirnos</h3>
               <ul className="space-y-4 text-slate-600">
                 <li className="flex items-start gap-4">
                   <div className="mt-1 w-9 h-9 bg-white rounded-full flex items-center justify-center border border-slate-100 text-sky-700">✓</div>
                   <div>
                     <p className="font-medium text-slate-900">Equipo certificado</p>
                     <p className="text-sm">Dentistas con formación continua y enfoque en atención humana.</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="mt-1 w-9 h-9 bg-white rounded-full flex items-center justify-center border border-slate-100 text-sky-700">⚙</div>
                   <div>
                     <p className="font-medium text-slate-900">Tecnología digital</p>
                     <p className="text-sm">Diagnósticos precisos con radiografía digital e impresión 3D cuando aplica.</p>
                   </div>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="mt-1 w-9 h-9 bg-white rounded-full flex items-center justify-center border border-slate-100 text-sky-700">🛡</div>
                   <div>
                     <p className="font-medium text-slate-900">Protocolos de seguridad</p>
                     <p className="text-sm">Esterilización rigurosa y ambientes confortables.</p>
                   </div>
                 </li>
               </ul>
             </div>
             <div className="flex items-center justify-center">
               <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg">
                 <img src="https://images.unsplash.com/photo-1616756793889-9b9b0b3f747b?w=800&q=80&auto=format&fit=crop" alt="Equipo dental" className="w-full h-64 object-cover" />
               </div>
             </div>
           </div>
         </div>
       </section>

       {/* Contact */}
       <section id="contacto" className="py-16">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-8 items-start">
             <div>
               <h3 className="text-2xl font-semibold text-slate-900 mb-4">Contáctanos</h3>
               <p className="text-slate-600 mb-6">¿Necesitas información o quieres reservar? Completa el formulario y te contactamos en breve.</p>

               <div className="space-y-4 text-slate-700">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700">📞</div>
                   <div>
                     <p className="text-sm text-slate-500">Teléfono</p>
                     <p className="font-medium">+52 55 1234 5678</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700">✉️</div>
                   <div>
                     <p className="text-sm text-slate-500">Email</p>
                     <p className="font-medium">contacto@dentalcare.com</p>
                   </div>
                 </div>
               </div>
             </div>

             <div>
               <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border border-slate-200 rounded-lg px-4 py-2" placeholder="Nombre completo" />
                   <input required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border border-slate-200 rounded-lg px-4 py-2" placeholder="Correo electrónico" />
                 </div>
                 <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-2" placeholder="Teléfono" />
                 <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-2 resize-none" placeholder="Mensaje" />

                 {formStatus.message && (
                   <div className={`p-3 rounded-lg ${formStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                     {formStatus.message}
                   </div>
                 )}

                 <div className="flex items-center gap-4">
                   <button type="submit" disabled={loading} className="bg-sky-700 hover:bg-sky-800 text-white px-5 py-2.5 rounded-lg font-medium disabled:opacity-50">{loading ? 'Enviando...' : 'Enviar mensaje'}</button>
                   <Link href="/appointments" className="text-slate-700 hover:text-slate-900">O reservar una cita</Link>
                 </div>
               </form>
             </div>
           </div>
         </div>
       </section>

       {/* Footer */}
       <footer className="border-t border-slate-100 py-8">
         <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-sky-700 to-blue-600 rounded-lg flex items-center justify-center text-white"> 
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 2C8 2 6 5 6 8c0 3 2 6 6 12 4-6 6-9 6-12 0-3-2-6-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </div>
             <div>
               <p className="font-semibold">DentalCare</p>
               <p className="text-xs text-slate-500">Clínica dental · CDMX</p>
             </div>
           </div>
           <p className="text-sm text-slate-500">© 2024 DentalCare. Todos los derechos reservados.</p>
         </div>
       </footer>
     </div>
   )
 }
