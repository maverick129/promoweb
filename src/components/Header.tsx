'use client'

import Link from 'next/link'

export default function Header() {
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
