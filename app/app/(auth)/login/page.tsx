import { GoogleButton } from '@/components/auth/google-button'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">MoltHome</h1>
          <p className="text-slate-400">Deploy your OpenClaw Gateway in minutes</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Sign in to continue</h2>
          <GoogleButton />
        </div>
      </div>
    </div>
  )
}
