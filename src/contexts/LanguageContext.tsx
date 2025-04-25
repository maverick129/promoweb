'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import enTranslations from '@/translations/en.json'
import idTranslations from '@/translations/id.json'

type Language = 'en' | 'id'

const translations = {
  en: enTranslations,
  id: idTranslations,
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: Record<string, unknown> | string = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k] as Record<string, unknown> | string
      } else {
        return key
      }
    }

    return value as string || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 