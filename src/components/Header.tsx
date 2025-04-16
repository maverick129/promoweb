'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { GiFarmer, GiCorn, GiWheat } from 'react-icons/gi'
import { TbConfetti } from 'react-icons/tb'

export default function Header() {
  const { t } = useLanguage()

  return (
    <div className="w-full bg-green-600 text-white py-4 relative overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <GiFarmer className="w-8 h-8 text-green-400 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <GiCorn className="w-8 h-8 text-green-400 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <GiWheat className="w-8 h-8 text-green-400 opacity-20" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-float-delay-3">
          <TbConfetti className="w-8 h-8 text-green-400 opacity-20" />
        </div>
        <div className="absolute bottom-1/3 left-1/2 animate-float-delay-4">
          <GiCorn className="w-8 h-8 text-green-400 opacity-20" />
        </div>
        <div className="absolute top-1/5 right-1/5 animate-float-delay-5">
          <GiFarmer className="w-8 h-8 text-green-400 opacity-20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h1 className="text-2xl font-bold">
          Jiva Prodi Harvest Champions
        </h1>
        <p className="text-lg mt-2">
          Join Indonesia's biggest agricultural promotion and win amazing prizes!
        </p>
      </div>
    </div>
  )
} 