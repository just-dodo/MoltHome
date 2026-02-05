import crypto from 'crypto'

export function verifyPaddleWebhook(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  const ts = signature.split(';').find(s => s.startsWith('ts='))?.split('=')[1]
  const h1 = signature.split(';').find(s => s.startsWith('h1='))?.split('=')[1]

  if (!ts || !h1) return false

  const signedPayload = `${ts}:${rawBody}`
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex')

  return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expectedSignature))
}

export interface PaddleSubscriptionEvent {
  event_type: string
  data: {
    id: string
    status: string
    customer_id: string
    items: Array<{
      price: {
        id: string
        product_id: string
      }
    }>
    custom_data?: {
      user_id?: string
    }
  }
}
