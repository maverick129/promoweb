'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { verifyOTP } from '@/services/otp';
import { generateRaffleTicket } from '@/services/raffle';

export default function VerifyOTP() {
  const router = useRouter();
  const { t } = useLanguage();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [raffleTicket, setRaffleTicket] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const phone = localStorage.getItem('registeringPhone');
      if (!phone) {
        throw new Error('Phone number not found');
      }

      const isValid = await verifyOTP(phone, otp);
      if (!isValid) {
        throw new Error('Invalid OTP');
      }

      // Generate raffle ticket
      const ticket = await generateRaffleTicket(phone);
      setRaffleTicket(ticket);
      
      // Clear phone from localStorage
      localStorage.removeItem('registeringPhone');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (raffleTicket) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">{t('registration.success')}</h1>
          <div className="bg-green-100 p-4 rounded-lg mb-6">
            <p className="text-green-800 font-bold text-center">{t('registration.raffleTicket')}</p>
            <p className="text-green-800 text-center mt-2 font-mono">{raffleTicket}</p>
          </div>
          <p className="text-gray-600 text-center mb-6">{t('registration.saveTicket')}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {t('common.continue')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">{t('registration.verifyOTP')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              {t('registration.enterOTP')}
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? t('common.verifying') : t('common.verify')}
          </button>
        </form>
      </div>
    </div>
  );
} 