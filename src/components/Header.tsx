'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { GiFarmer, GiCorn, GiWheat } from 'react-icons/gi'
import { TbConfetti } from 'react-icons/tb'

export default function Header() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">Jiva Prodi</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 