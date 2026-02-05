import { create } from 'zustand'

interface WizardState {
  step: number
  data: {
    name: string
    zone: string
    anthropicKey: string
    channels: Array<{ type: string; token: string }>
  }
  setStep: (step: number) => void
  updateData: (data: Partial<WizardState['data']>) => void
  addChannel: (channel: { type: string; token: string }) => void
  removeChannel: (index: number) => void
  reset: () => void
}

const initialData = {
  name: '',
  zone: 'us-central1-a',
  anthropicKey: '',
  channels: [],
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 0,
  data: initialData,
  setStep: (step) => set({ step }),
  updateData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
  addChannel: (channel) => set((state) => ({
    data: { ...state.data, channels: [...state.data.channels, channel] }
  })),
  removeChannel: (index) => set((state) => ({
    data: { ...state.data, channels: state.data.channels.filter((_, i) => i !== index) }
  })),
  reset: () => set({ step: 0, data: initialData }),
}))
