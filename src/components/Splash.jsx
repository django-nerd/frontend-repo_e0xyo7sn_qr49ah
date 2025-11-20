import { useEffect } from 'react'

function Splash({ onDone, imageUrl }) {
  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 5000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center animate-fade-in">
        <div className="w-40 h-40 mx-auto mb-6 rounded-full ring-4 ring-blue-500/40 overflow-hidden shadow-2xl">
          <img
            src={imageUrl || '/flame-icon.svg'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-blue-200">Loading your dashboard...</p>
        <div className="w-48 h-2 bg-slate-700/60 rounded-full mx-auto mt-4 overflow-hidden">
          <div className="h-full bg-blue-500 animate-loading-bar" />
        </div>
      </div>
    </div>
  )
}

export default Splash
