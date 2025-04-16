'use client'

import { useRouter } from 'next/navigation'
import { FaTshirt, FaTrophy, FaMapMarkerAlt, FaTicketAlt, FaGift, FaUsers, FaCalendarAlt, FaTruck } from 'react-icons/fa'
import { GiWheat, GiCorn, GiPlantRoots, GiSpray, GiFarmer } from 'react-icons/gi'
import { MdCelebration } from 'react-icons/md'
import { TbConfetti } from 'react-icons/tb'
import { useLanguage } from '@/contexts/LanguageContext'
import Footer from '@/components/Footer'

export default function Home() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20 relative overflow-hidden">
          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 animate-float">
              <GiWheat className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
              <GiCorn className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
              <GiPlantRoots className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-1/2 right-1/3 animate-float-delay-3">
              <GiSpray className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute bottom-1/3 left-1/2 animate-float-delay-4">
              <FaTruck className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-1/5 right-1/5 animate-float-delay-5">
              <GiFarmer className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute bottom-1/5 left-1/5 animate-float-delay-6">
              <MdCelebration className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-2/3 right-1/6 animate-float-delay-7">
              <TbConfetti className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute top-1/6 left-1/6 animate-float-delay-8">
              <GiCorn className="w-12 h-12 text-green-400 opacity-20" />
            </div>
            <div className="absolute bottom-1/6 right-1/6 animate-float-delay-9">
              <GiWheat className="w-12 h-12 text-green-400 opacity-20" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t('home.title')}
            </h1>
            <p className="text-xl mb-8 text-white">
              {t('home.subtitle')}
            </p>
            <button
              onClick={() => router.push('/register')}
              className="bg-white text-green-800 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-colors"
            >
              {t('common.register')}
            </button>
          </div>
        </div>

        {/* Competition Info Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-green-900 mb-4">
              {t('home.competitions.title')}
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">
                <FaGift />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('home.competitions.dailyPrizes.title')}
              </h3>
              <p className="text-gray-800 text-lg">
                {t('home.competitions.dailyPrizes.description')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('home.competitions.communityEvents.title')}
              </h3>
              <p className="text-gray-800 text-lg">
                {t('home.competitions.communityEvents.description')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">
                <FaCalendarAlt />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-900">
                {t('home.competitions.seasonalRewards.title')}
              </h3>
              <p className="text-gray-800 text-lg">
                {t('home.competitions.seasonalRewards.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white bg-opacity-60">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
              {t('home.howToParticipate.title')}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.howToParticipate.register.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.howToParticipate.register.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.howToParticipate.findStore.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.howToParticipate.findStore.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.howToParticipate.enterCode.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.howToParticipate.enterCode.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prizes Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
              {t('home.prizes.title')}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-600 mb-4">
                  <FaTshirt className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.prizes.tShirts.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.prizes.tShirts.description')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-600 mb-4">
                  <FaTrophy className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.prizes.caps.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.prizes.caps.description')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-600 mb-4">
                  <FaMapMarkerAlt className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.prizes.waterBottles.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.prizes.waterBottles.description')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-green-600 mb-4">
                  <FaTruck className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-900">
                  {t('home.prizes.majorPrizes.title')}
                </h3>
                <p className="text-gray-600">
                  {t('home.prizes.majorPrizes.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
