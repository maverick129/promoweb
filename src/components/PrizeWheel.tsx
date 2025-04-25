'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

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
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<Prize | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || prizes.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const segmentAngle = (2 * Math.PI) / prizes.length
    prizes.forEach((prize, index) => {
      const startAngle = index * segmentAngle
      const endAngle = startAngle + segmentAngle

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = prize.color
      ctx.fill()

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + segmentAngle / 2)
      ctx.textAlign = 'center'
      ctx.fillStyle = prize.textColor
      ctx.font = 'bold 48px Arial'
      ctx.fillText(prize.symbol, radius - 60, 0)
      ctx.restore()
    })

    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
    ctx.fillStyle = '#4B5563'
    ctx.fill()
  }, [prizes])

  useEffect(() => {
    drawWheel()
  }, [drawWheel])

  const spin = () => {
    if (isSpinning || prizes.length === 0) return

    setIsSpinning(true)
    setWinner(null)

    // Calculate winning prize
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0)
    let random = Math.random() * totalProbability
    let winningPrize = prizes[0]

    for (const prize of prizes) {
      random -= prize.probability
      if (random <= 0) {
        winningPrize = prize
        break
      }
    }

    // Calculate final rotation
    const prizeIndex = prizes.findIndex(p => p.id === winningPrize.id)
    const segmentAngle = 360 / prizes.length
    const finalRotation = 360 * 5 + (270 - (prizeIndex * segmentAngle + segmentAngle / 2))

    // Animate rotation
    const currentRotation = rotation % 360
    const startTime = Date.now()
    const duration = 5000 // 5 seconds

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (cubic ease-out)
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
      const currentProgress = easeOut(progress)

      const newRotation = currentRotation + (finalRotation * currentProgress)
      setRotation(newRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        setWinner(winningPrize)
        onSpinComplete(winningPrize)
        if (winningPrize.name !== 'Better Luck Next Time') {
          launchConfetti()
        }
      }
    }

    requestAnimationFrame(animate)
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

  return (
    <div className="flex flex-col items-center">
      {winner && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
          <p className="text-lg font-semibold text-green-800">
            {t('prizeWheel.winningMessage')} {t(`prizes.${winner.type}.${winner.id}.name`)}
          </p>
        </div>
      )}
      <div className="flex items-center gap-12">
        {/* Logo */}
        <div className="hidden md:block w-48 h-48 bg-green-50 rounded-full flex items-center justify-center shadow-lg p-4">
          <Image
            src="/images/jivaphala-logo.png" 
            alt="Jivaphala Logo" 
            className="w-full h-full object-contain rounded-full border-4 border-green-600"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiBmaWxsPSIjMTY2NTM0Ii8+PHBhdGggZD0iTTEyIDZ2MTJNNiAxMmgxMiIgc3Ryb2tlPSIjRkNEMzREIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=='
            }}
          />
        </div>

        {/* Wheel */}
        <div className="relative w-[400px] h-[400px]">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
            }}
          />
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-red-600"></div>
          </div>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className={`mt-8 px-8 py-4 text-xl font-bold rounded-full shadow-lg transform transition-all relative overflow-hidden ${
          isSpinning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-purple-500 hover:via-pink-600 hover:to-red-600 hover:scale-105 active:scale-95'
        } text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
      >
        <span className="flex items-center gap-2">
          {isSpinning ? (
            t('common.loading')
          ) : (
            <>
              <span className="text-2xl">🦄</span>
              <span>{t('prizeWheel.spinButton')}</span>
              <span className="text-2xl">🌈</span>
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