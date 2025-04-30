'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQ() {
  const { t } = useLanguage()
  const [questions] = useState<FAQItem[]>(() => {
    const translatedQuestions = t('faq.questions') as unknown as FAQItem[];
    return Array.isArray(translatedQuestions) ? translatedQuestions : [];
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-green-900 mb-8">
          {t('faq.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('faq.subtitle')}
        </p>
        <div className="space-y-6">
          {questions.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
} 