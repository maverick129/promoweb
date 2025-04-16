'use client'

import { useEffect, useRef } from 'react'

interface Prize {
  id: string
  name: string
  description: string
  probability: number
  color: string
}

interface PrizeWheelProps {
  prizes: Prize[]
  onSpinComplete: (prize: Prize) => void
}

export default function PrizeWheel({ prizes, onSpinComplete }: PrizeWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spinTimeoutRef = useRef<NodeJS.Timeout>()
  const currentRotationRef = useRef(0)
  const isSpinningRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const size = Math.min(canvas.parentElement?.clientWidth || 400, 400)
    canvas.width = size
    canvas.height = size

    // Calculate angles based on probabilities
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0)
    let currentAngle = 0

    prizes.forEach((prize, index) => {
      const angle = (prize.probability / totalProbability) * Math.PI * 2
      const startAngle = currentAngle
      const endAngle = currentAngle + angle

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(size / 2, size / 2)
      ctx.arc(size / 2, size / 2, size / 2, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = prize.color
      ctx.fill()

      // Draw text
      ctx.save()
      ctx.translate(size / 2, size / 2)
      ctx.rotate(startAngle + angle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(prize.name, size / 2 - 10, 0)
      ctx.restore()

      currentAngle = endAngle
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, 20, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.stroke()

    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current)
      }
    }
  }, [prizes])

  const spin = () => {
    if (isSpinningRef.current) return
    isSpinningRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = canvas.width
    const spinDuration = 3000 // 3 seconds
    const startTime = Date.now()
    const startRotation = currentRotationRef.current
    const spinRevolutions = 5 // Number of full rotations
    const finalRotation = Math.random() * Math.PI * 2

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / spinDuration, 1)

      // Easing function for smooth deceleration
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

      const rotation =
        startRotation +
        easeOut(progress) * (spinRevolutions * Math.PI * 2 + finalRotation)

      currentRotationRef.current = rotation

      // Clear and redraw
      ctx.clearRect(0, 0, size, size)
      ctx.save()
      ctx.translate(size / 2, size / 2)
      ctx.rotate(rotation)
      ctx.translate(-size / 2, -size / 2)

      // Redraw wheel
      const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0)
      let currentAngle = 0

      prizes.forEach((prize) => {
        const angle = (prize.probability / totalProbability) * Math.PI * 2
        const startAngle = currentAngle
        const endAngle = currentAngle + angle

        ctx.beginPath()
        ctx.moveTo(size / 2, size / 2)
        ctx.arc(size / 2, size / 2, size / 2, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = prize.color
        ctx.fill()

        ctx.save()
        ctx.translate(size / 2, size / 2)
        ctx.rotate(startAngle + angle / 2)
        ctx.textAlign = 'right'
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 12px Arial'
        ctx.fillText(prize.name, size / 2 - 10, 0)
        ctx.restore()

        currentAngle = endAngle
      })

      ctx.restore()

      // Draw center circle
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, 20, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.stroke()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        isSpinningRef.current = false
        // Determine winning prize
        const normalizedRotation = rotation % (Math.PI * 2)
        let currentAngle = 0
        let winningPrize = prizes[0]

        for (const prize of prizes) {
          const angle = (prize.probability / totalProbability) * Math.PI * 2
          if (normalizedRotation >= currentAngle && normalizedRotation < currentAngle + angle) {
            winningPrize = prize
            break
          }
          currentAngle += angle
        }

        onSpinComplete(winningPrize)
      }
    }

    requestAnimationFrame(animate)
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={spin}
        style={{ cursor: 'pointer' }}
      />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="w-4 h-4 bg-red-500"></div>
      </div>
    </div>
  )
} 