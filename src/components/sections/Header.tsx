'use client'

import { Phone } from 'lucide-react'

export default function Header() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">PhoneDrop</span>
        </button>
      </nav>
    </header>
  )
}
