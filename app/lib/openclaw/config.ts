export interface OpenClawConfigOptions {
  gatewayToken: string
  aiProvider: 'anthropic' | 'openai' | 'gemini'
  aiApiKey: string
}

export function generateOpenClawConfig(options: OpenClawConfigOptions) {
  const { gatewayToken, aiProvider, aiApiKey } = options

  return {
    gateway: {
      auth: {
        token: gatewayToken,
      },
      port: 18789,
    },
    ai: {
      provider: aiProvider,
      apiKey: aiApiKey,
      // Provider-specific settings
      ...(aiProvider === 'anthropic' && {
        model: 'claude-sonnet-4-20250514',
      }),
      ...(aiProvider === 'openai' && {
        model: 'gpt-4o',
      }),
      ...(aiProvider === 'gemini' && {
        model: 'gemini-2.0-flash',
      }),
    },
    channels: {},
  }
}

export function generateDockerComposeConfig(gatewayToken: string) {
  return `
version: '3.8'
services:
  openclaw-gateway:
    image: openclaw-gateway
    container_name: openclaw-gateway
    restart: unless-stopped
    ports:
      - "18789:18789"
    volumes:
      - ~/.openclaw:/root/.openclaw
    environment:
      - GATEWAY_TOKEN=${gatewayToken}
`
}
