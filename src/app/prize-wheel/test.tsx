'use client'

import { useState } from 'react'
import PrizeWheel from './page'

export default function PrizeWheelTest() {
  const [testCount, setTestCount] = useState(0)
  const [results, setResults] = useState<{ prize: string; count: number }[]>([])

  const runTest = () => {
    // Simulate 100 spins
    const testResults: { [key: string]: number } = {}
    
    for (let i = 0; i < 100; i++) {
      // Simulate wheel spin
      const fullRotations = 3 + Math.floor(Math.random() * 3)
      const additionalRotation = Math.random() * 360
      const finalRotation = (fullRotations * 360 + additionalRotation) % 360
      
      // Determine prize based on final rotation
      const segmentAngle = 360 / 4 // 4 prizes
      const prizeIndex = Math.floor(finalRotation / segmentAngle)
      const prizes = ['T-Shirt', 'Cap', 'Water Bottle', 'Better Luck Next Time']
      const prize = prizes[prizeIndex]
      
      // Record result
      testResults[prize] = (testResults[prize] || 0) + 1
    }

    // Convert results to array and sort by count
    const sortedResults = Object.entries(testResults)
      .map(([prize, count]) => ({ prize, count }))
      .sort((a, b) => b.count - a.count)

    setResults(sortedResults)
    setTestCount(prev => prev + 1)
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Prize Wheel Test Results</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <button
              onClick={runTest}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Run Test (100 spins)
            </button>
            <p className="mt-4 text-gray-600">
              Tests run: {testCount}
            </p>
          </div>

          {/* Results */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Distribution Results</h2>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{result.prize}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-600 h-4 rounded-full"
                          style={{ width: `${(result.count / 100) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-600">{result.count}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Run a test to see the distribution</p>
            )}
          </div>
        </div>

        {/* Live Wheel */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Live Wheel</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <PrizeWheel />
          </div>
        </div>
      </div>
    </div>
  )
} 