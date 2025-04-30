'use client'

import { FaTshirt, FaHatCowboy, FaTicketAlt, FaBox, FaMoneyBillWave, FaMobileAlt, FaTv } from 'react-icons/fa'
import { GiSpray } from 'react-icons/gi'
import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Prizes() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-900 mb-4">
            {t('prizes.title')}
          </h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('prizes.subtitle')}
          </p>
        </div>

        {/* Instant Win Prizes */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-green-800 mb-8">
            {t('prizes.instantWin')}
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaBox className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.instantPrizes.sojikyo5kg.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.instantPrizes.sojikyo5kg.description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <GiSpray className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.instantPrizes.sprayer.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.instantPrizes.sprayer.description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaTshirt className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.instantPrizes.tshirt.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.instantPrizes.tshirt.description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaHatCowboy className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.instantPrizes.hat.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.instantPrizes.hat.description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaTicketAlt className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.instantPrizes.voucher20k.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.instantPrizes.voucher20k.description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaTicketAlt className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.instantPrizes.voucher50k.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.instantPrizes.voucher50k.description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaTicketAlt className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.instantPrizes.voucher100k.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.instantPrizes.voucher100k.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Raffle Prizes */}
        <div>
          <h3 className="text-2xl font-bold text-center text-green-800 mb-8">
            {t('prizes.rafflePrize')}
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="absolute -top-4 right-4">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  {t('prizes.grandPrize')}
                </span>
              </div>
              <div className="text-green-600 mb-4">
                <FaMoneyBillWave className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.rafflePrizes.cash.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.rafflePrizes.cash.description')}
              </p>
              <div className="mt-4 text-sm text-green-700">
                {t('prizes.rafflePrizes.cash.drawingDate')}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaMobileAlt className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.rafflePrizes.phone.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.rafflePrizes.phone.description')}
              </p>
              <div className="mt-4 text-sm text-green-700">
                {t('prizes.rafflePrizes.phone.drawingDate')}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaBox className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.rafflePrizes.sojikyo300kg.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.rafflePrizes.sojikyo300kg.description')}
              </p>
              <div className="mt-4 text-sm text-green-700">
                {t('prizes.rafflePrizes.sojikyo300kg.drawingDate')}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaTv className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.rafflePrizes.tv.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.rafflePrizes.tv.description')}
              </p>
              <div className="mt-4 text-sm text-green-700">
                {t('prizes.rafflePrizes.tv.drawingDate')}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105">
              <div className="text-green-600 mb-4">
                <FaTicketAlt className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('prizes.rafflePrizes.voucher2m.title')}
              </h3>
              <p className="text-gray-600">
                {t('prizes.rafflePrizes.voucher2m.description')}
              </p>
              <div className="mt-4 text-sm text-green-700">
                {t('prizes.rafflePrizes.voucher2m.drawingDate')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 