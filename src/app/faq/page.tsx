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
  const faqQuestions = [
    {
      question: t('faq.questions.0.question'),
      answer: t('faq.questions.0.answer')
    },
    {
      question: t('faq.questions.1.question'),
      answer: t('faq.questions.1.answer')
    },
    {
      question: t('faq.questions.2.question'),
      answer: t('faq.questions.2.answer')
    },
    {
      question: t('faq.questions.3.question'),
      answer: t('faq.questions.3.answer')
    },
    {
      question: t('faq.questions.4.question'),
      answer: t('faq.questions.4.answer')
    },
    {
      question: t('faq.questions.5.question'),
      answer: t('faq.questions.5.answer')
    },
    {
      question: t('faq.questions.6.question'),
      answer: t('faq.questions.6.answer')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          {t('faq.title')}
        </h1>

        <div className="space-y-6">
          {faqQuestions.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            {t('faq.contact.title')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t('faq.contact.description')}
          </p>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {t('faq.contact.email')}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {t('faq.contact.phone')}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 