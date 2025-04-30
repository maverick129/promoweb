'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaStore, FaGift, FaQuestionCircle, FaGlobe, FaArrowLeft } from 'react-icons/fa'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useRef, useEffect } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => pathname === path

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' }
  ]

  const navigationItems = [
    { name: 'home', href: '/', icon: FaHome, translationKey: 'navigation.home' },
    { name: 'storeFinder', href: '/store-finder', icon: FaStore, translationKey: 'navigation.findStore' },
    { name: 'prizes', href: '/prizes', icon: FaGift, translationKey: 'navigation.prizes' },
    { name: 'faq', href: '/faq', icon: FaQuestionCircle, translationKey: 'navigation.faq' }
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            {pathname !== '/' && (
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <FaArrowLeft className="mr-2" />
                {t('navigation.back')}
              </Link>
            )}
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.href)
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="mr-2" />
                  {t(item.translationKey)}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                aria-label="Language selector"
              >
                <FaGlobe className="h-5 w-5" />
                <span className="ml-1 text-sm sm:hidden">{languages.find(lang => lang.code === language)?.flag}</span>
                <span className="sr-only">{t('navigation.language')}</span>
              </button>
              {isOpen && (
                <div className="fixed sm:absolute inset-x-0 bottom-0 sm:bottom-auto sm:right-0 sm:mt-2 sm:w-48 rounded-t-lg sm:rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200 ease-in-out">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'en' | 'id')
                          setIsOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center ${
                          language === lang.code
                            ? 'bg-green-50 text-green-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 