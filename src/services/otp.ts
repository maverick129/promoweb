import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Rate limiting configuration
const MAX_OTP_ATTEMPTS = 3
const OTP_EXPIRY_MINUTES = 5
const RATE_LIMIT_WINDOW_MINUTES = 15
const MAX_OTPS_PER_WINDOW = 3

// Phone number validation schema
const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be at most 15 digits')
  .regex(/^\+?[0-9]+$/, 'Phone number must contain only digits and optional + prefix')

// OTP validation schema
const otpSchema = z.string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^[0-9]+$/, 'OTP must contain only digits')

export async function generateOTP(phone: string): Promise<string> {
  try {
    // Validate phone number
    const validatedPhone = phoneSchema.parse(phone)

    // Check rate limiting
    const recentOtps = await prisma.oTP.count({
      where: {
        phone: validatedPhone,
        createdAt: {
          gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000)
        }
      }
    })

    if (recentOtps >= MAX_OTPS_PER_WINDOW) {
      throw new Error('Too many OTP requests. Please try again later.')
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in database with expiration
    await prisma.oTP.create({
      data: {
        phone: validatedPhone,
        code: otp,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
        attempts: 0
      }
    })

    // In production, send OTP via SMS
    console.log(`OTP for ${validatedPhone}: ${otp}`)
    
    return otp
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid phone number format')
    }
    console.error('Error generating OTP:', error)
    throw new Error('Failed to generate OTP')
  }
}

export async function verifyOTP(phone: string, code: string): Promise<boolean> {
  try {
    // Validate inputs
    const validatedPhone = phoneSchema.parse(phone)
    const validatedCode = otpSchema.parse(code)

    // Find the most recent valid OTP
    const otp = await prisma.oTP.findFirst({
      where: {
        phone: validatedPhone,
        code: validatedCode,
        expiresAt: {
          gt: new Date()
        },
        attempts: {
          lt: MAX_OTP_ATTEMPTS
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otp) {
      // Increment attempts for all recent OTPs
      await prisma.oTP.updateMany({
        where: {
          phone: validatedPhone,
          createdAt: {
            gte: new Date(Date.now() - OTP_EXPIRY_MINUTES * 60 * 1000)
          }
        },
        data: {
          attempts: {
            increment: 1
          }
        }
      })
      return false
    }

    // Delete used OTP
    await prisma.oTP.delete({
      where: { id: otp.id }
    })

    // Clean up expired OTPs
    await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid OTP format')
    }
    console.error('Error verifying OTP:', error)
    throw new Error('Failed to verify OTP')
  }
} 