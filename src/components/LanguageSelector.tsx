import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'id');
  };

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="en">English</option>
      <option value="id">Indonesia</option>
    </select>
  );
} 