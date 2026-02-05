import { Paddle, initializePaddle } from '@paddle/paddle-js'

let paddleInstance: Paddle | null = null

export async function getPaddle(): Promise<Paddle> {
  if (paddleInstance) return paddleInstance

  const paddle = await initializePaddle({
    environment: 'sandbox',
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
  })

  if (!paddle) {
    throw new Error('Failed to initialize Paddle')
  }

  paddleInstance = paddle
  return paddleInstance
}

export const PADDLE_PRICES = {
  starter: 'pri_01jmqk8ywz0vt4hy8qmz7qxpvh', // Replace with actual price ID
  pro: 'pri_01jmqk9xyz0vt4hy8qmz7qxpvi', // Replace with actual price ID
} as const

export type PlanTier = keyof typeof PADDLE_PRICES
