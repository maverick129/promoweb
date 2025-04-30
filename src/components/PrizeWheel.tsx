'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Winwheel from 'winwheel'

interface Prize {
  id: string
  name: string
  description: string
  type: string
  probability: number
  quantity: number
  remaining: number
  claimed: number
  color: string
  textColor: string
  symbol: string
}

interface PrizeWheelProps {
  prizes: Prize[]
  onSpinComplete: (prize: Prize) => void
}

export default function PrizeWheel({ prizes, onSpinComplete }: PrizeWheelProps) {
  const { t } = useLanguage()
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<Prize | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const wheelRef = useRef<HTMLCanvasElement>(null)
  const winwheelRef = useRef<any>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !wheelRef.current) return

    // Filter prizes to only include the specified ones
    const filteredPrizes = prizes.filter(prize => [
      'SOJIKYO 5 KG',
      'Jiva Sprayer 2L',
      'Jiva Tshirt',
      'Jiva Hat',
      'Jiva Toko Voucher Rp 20.000',
      'Jiva Toko Voucher Rp 50.000',
      'Jiva Toko Voucher Rp 100.000',
      'Better Luck Next Time'
    ].includes(prize.name))

    // Create wheel segments
    const segments = filteredPrizes.map((prize, index) => ({
      fillStyle: prize.color,
      text: prize.symbol,
      textFontSize: 24,
      textFillStyle: prize.textColor,
      textFontFamily: 'Arial',
      textFontWeight: 'bold',
      textOrientation: 'vertical',
      textAlignment: 'center',
      textMargin: 5,
      size: 1,
      prize: prize,
      segmentNumber: index + 1
    }))

    // Initialize the wheel
    const canvas = wheelRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Set canvas dimensions
    canvas.width = 400
    canvas.height = 400

    winwheelRef.current = new Winwheel({
      canvasId: 'prize-wheel',
      numSegments: segments.length,
      segments: segments,
      outerRadius: 170,
      centerX: 200,
      centerY: 200,
      innerRadius: 0,
      drawMode: 'code',
      drawText: true,
      textFontSize: 24,
      textOrientation: 'vertical',
      textAlignment: 'center',
      textMargin: 5,
      textFontFamily: 'Arial',
      textFontWeight: 'bold',
      textFillStyle: '#ffffff',
      strokeStyle: '#000000',
      lineWidth: 2,
      clearTheCanvas: true,
      animation: {
        type: 'spinToStop',
        duration: 5,
        spins: 5,
        callbackFinished: alertPrize,
        callbackAfter: drawPointer
      },
      pointerAngle: 0,
      ctx: ctx
    })

    // Draw the pointer
    drawPointer()

    return () => {
      if (winwheelRef.current) {
        winwheelRef.current.stopAnimation()
      }
    }
  }, [prizes, isMounted])

  const drawPointer = () => {
    if (!winwheelRef.current) return

    const ctx = winwheelRef.current.ctx
    ctx.strokeStyle = 'navy'
    ctx.fillStyle = 'gold'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(170, 5)
    ctx.lineTo(230, 5)
    ctx.lineTo(200, 40)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }, [prizes])

  useEffect(() => {
    drawWheel()
  }, [drawWheel])

  const alertPrize = (indicatedSegment: any) => {
    const winningPrize = indicatedSegment.prize
    setWinner(winningPrize)
    onSpinComplete(winningPrize)
    if (winningPrize.name !== 'Better Luck Next Time') {
      launchConfetti()
    }
  }

  const spin = () => {
    if (isSpinning || !winwheelRef.current) return

    setIsSpinning(true)
    setWinner(null)

    // Calculate winning prize based on probabilities
    const totalProbability = winwheelRef.current.segments.reduce((sum: number, segment: any) => 
      sum + segment.prize.probability, 0)
    let random = Math.random() * totalProbability
    let winningSegment = winwheelRef.current.segments[0]

    for (const segment of winwheelRef.current.segments) {
      random -= segment.prize.probability
      if (random <= 0) {
        winningSegment = segment
        break
      }
    }

    // Calculate the angle to stop at
    const segmentAngle = 360 / winwheelRef.current.segments.length
    const targetAngle = 360 - (winningSegment.segmentNumber * segmentAngle + segmentAngle / 2)
    
    // Start the spin
    winwheelRef.current.animation.stopAngle = targetAngle
    winwheelRef.current.startAnimation()

  }

  const launchConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#00FFFF']
    }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const launchConfetti = () => {
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount: 50,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }

    launchConfetti()
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      launchConfetti()
    }, 250)
  }

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="relative w-full max-w-[300px] md:max-w-[400px] aspect-square bg-gray-100 rounded-full animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      {winner && (
        <div className={`mt-4 p-4 rounded-lg text-center w-full max-w-md ${
          winner.name === 'Better Luck Next Time' 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          <p className="text-lg font-semibold">
            {winner.name === 'Better Luck Next Time' 
              ? 'Better luck next time! Keep trying! 🍀'
              : `Congratulations! You won: ${winner.name} 🎉`}
          </p>
          {winner.name !== 'Better Luck Next Time' && winner.description && (
            <p className="mt-2 text-sm text-green-700">
              {winner.description}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 w-full">
        {/* Logo */}
        <div className="hidden md:flex w-32 h-32 md:w-48 md:h-48 bg-green-50 rounded-full items-center justify-center shadow-lg p-4">
          <img
            src="/images/jivaphala-logo.png" 
            alt="Jivaphala Logo" 
            className="w-full h-full object-contain rounded-full border-4 border-green-600"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBmaWxsPSIjMTY2NTM0Ii8+PHBhdGggZD0iTTEyIDZ2MTJNNiAxMmgxMiIgc3Ryb2tlPSIjRkNEMzREIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=='
            }}
          />
        </div>

        {/* Wheel Container */}
        <div className="relative w-full max-w-[300px] md:max-w-[400px] aspect-square">
          <canvas
            id="prize-wheel"
            ref={wheelRef}
            width="400"
            height="400"
            className="w-full h-full transform rounded-full shadow-xl"
          />
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className={`mt-8 px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-bold rounded-full shadow-lg transform transition-all relative overflow-hidden ${
          isSpinning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-purple-500 hover:via-pink-600 hover:to-red-600 hover:scale-105 active:scale-95'
        } text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
      >
        <span className="flex items-center gap-2">
          {isSpinning ? (
            <>
              <span className="animate-spin">🎡</span>
              <span>Spinning...</span>
            </>
          ) : (
            <>
              <span className="text-2xl">🎯</span>
              <span>Spin to Win!</span>
              <span className="text-2xl">✨</span>
            </>
          )}
        </span>
        {!isSpinning && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
        )}
      </button>
    </div>
  )
} 