import { z } from 'zod'

export const apiKeyTypes = ['anthropic', 'openai', 'gemini'] as const
export type ApiKeyType = typeof apiKeyTypes[number]

export const createInstanceSchema = z.object({
  name: z.string().min(1).max(50),
  zone: z.string().default('us-central1-a'),
  aiProvider: z.enum(apiKeyTypes).default('anthropic'),
  aiApiKey: z.string().min(1),
})

export const addChannelSchema = z.object({
  type: z.enum(['telegram', 'discord']),
  config: z.object({
    botToken: z.string().min(1),
  }),
})

export const approvePairingSchema = z.object({
  channel: z.string(),
  code: z.string().min(1),
})

export type CreateInstanceInput = z.infer<typeof createInstanceSchema>
export type AddChannelInput = z.infer<typeof addChannelSchema>
export type ApprovePairingInput = z.infer<typeof approvePairingSchema>
