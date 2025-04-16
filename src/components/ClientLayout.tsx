'use client'

import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {children}
      </main>
    </LanguageProvider>
  )
} 