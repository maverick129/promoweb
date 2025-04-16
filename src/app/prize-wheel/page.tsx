'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import confetti from 'canvas-confetti'
import { FaTshirt, FaSpinner, FaHatCowboy, FaWater, FaTimesCircle } from 'react-icons/fa'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const prizes = [
  { 
    id: 1, 
    name: 'T-Shirt', 
    color: '#166534', 
    textColor: '#FCD34D',
    symbol: '👕'
  },
  { 
    id: 2, 
    name: 'Cap', 
    color: '#065F46', 
    textColor: '#FCD34D',
    symbol: '🧢'
  },
  { 
    id: 3, 
    name: 'Water Bottle', 
    color: '#047857', 
    textColor: '#FCD34D',
    symbol: '🥤'
  },
  { 
    id: 4, 
    name: 'Better Luck Next Time', 
    color: '#991B1B', 
    textColor: '#FCD34D',
    symbol: '❌'
  },
]

export default function PrizeWheel() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<typeof prizes[0] | null>(null)
  const [rotation, setRotation] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw segments
    const segmentAngle = (2 * Math.PI) / prizes.length
    prizes.forEach((prize, index) => {
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(
        centerX,
        centerY,
        radius,
        index * segmentAngle,
        (index + 1) * segmentAngle
      )
      ctx.closePath()
      ctx.fillStyle = prize.color
      ctx.fill()
      ctx.stroke()

      // Add symbol
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(index * segmentAngle + segmentAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = prize.textColor
      ctx.font = '32px Arial'
      ctx.fillText(prize.symbol, radius - 40, 10)
      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
    ctx.fillStyle = '#FCD34D'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.stroke()
  }

  useEffect(() => {
    drawWheel()
  }, [])

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinner(null)
    setShowCelebration(false)

    // Random number of full rotations (3-5)
    const fullRotations = 3 + Math.floor(Math.random() * 3)
    // Random additional rotation (0-360)
    const additionalRotation = Math.random() * 360
    // Total target rotation
    const targetRotation = fullRotations * 360 + additionalRotation

    // Animate the spin with easing
    const startRotation = rotation
    const startTime = performance.now()
    const duration = 5000 // 5 seconds

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
      const currentRotation = startRotation + (targetRotation - startRotation) * easeOut(progress)
      
      setRotation(currentRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Spin complete - determine the prize based on final rotation
        const normalizedRotation = (currentRotation % 360 + 360) % 360 // Ensure positive angle
        const segmentAngle = 360 / prizes.length
        
        // The pointer is at 0 degrees (top)
        // Each segment is 90 degrees (for 4 prizes)
        // We want the prize that's at the top when the wheel stops
        // Since the wheel rotates clockwise, we need to:
        // 1. Calculate which segment is at the top (0 degrees)
        // 2. The prize at the top is the one that's directly under the pointer
        const prizeIndex = Math.floor(normalizedRotation / segmentAngle) % prizes.length
        const winningPrize = prizes[prizeIndex]
        
        // Add a small delay before showing the winner to ensure wheel has stopped
        setTimeout(() => {
          setIsSpinning(false)
          setWinner(winningPrize)
          
          // Show celebration for all prizes except "Better Luck Next Time"
          if (winningPrize.name !== 'Better Luck Next Time') {
            setShowCelebration(true)
            
            const count = 200
            const defaults = {
              origin: { y: 0.7 },
              zIndex: 9999
            }

            function fire(particleRatio: number, opts: Record<string, unknown>) {
              confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
              })
            }

            fire(0.25, {
              spread: 26,
              startVelocity: 55,
            })

            fire(0.2, {
              spread: 60,
            })

            fire(0.35, {
              spread: 100,
              decay: 0.91,
              scalar: 0.8,
            })

            fire(0.1, {
              spread: 120,
              startVelocity: 25,
              decay: 0.92,
              scalar: 1.2,
            })

            fire(0.1, {
              spread: 120,
              startVelocity: 45,
            })
          }
        }, 500) // 500ms delay after wheel stops
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <Header />
      <div className="max-w-2xl mx-auto text-center flex-grow">
        <h1 className="text-3xl font-bold text-green-900 mb-4">
          {t('prizeWheel.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('prizeWheel.subtitle')}
        </p>

        <div className="relative w-[400px] h-[400px] mx-auto mb-8">
          {/* Prize Wheel */}
          <div
            ref={wheelRef}
            className="absolute inset-0 transition-transform duration-[5000ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <canvas
              ref={canvasRef}
              width="400"
              height="400"
              className="w-full h-full"
            />
          </div>

          {/* Center pointer */}
          <div className="absolute top-0 left-1/2 -ml-4 w-8 h-12 z-10">
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[24px] border-t-yellow-500" />
          </div>
        </div>

        {winner && (
          <div className={`bg-white rounded-lg shadow-lg p-6 mb-8 ${winner.name !== 'Better Luck Next Time' && showCelebration ? 'animate-bounce' : ''}`}>
            <h2 className={`text-2xl font-bold mb-2 ${winner.name === 'Better Luck Next Time' ? 'text-red-600' : 'text-gray-900'}`}>
              {winner.name === 'Better Luck Next Time' 
                ? t('prizeWheel.betterLuck')
                : t('prizeWheel.congratulations')}
            </h2>
            <p className={`text-xl ${winner.name === 'Better Luck Next Time' ? 'text-gray-600' : 'text-gray-700'}`}>
              {winner.name === 'Better Luck Next Time' 
                ? t('prizeWheel.tryAgain')
                : `${t('prizeWheel.prize.won')} <span className="font-bold text-green-600">${winner.name}</span>`}
            </p>
          </div>
        )}

        {!winner && (
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`px-8 py-4 text-lg font-medium rounded-full shadow-lg transform transition-transform ${
              isSpinning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                {t('prizeWheel.spinning')}
              </span>
            ) : (
              t('prizeWheel.spinButton')
            )}
          </button>
        )}
      </div>
      <Footer />
    </div>
  )
} 