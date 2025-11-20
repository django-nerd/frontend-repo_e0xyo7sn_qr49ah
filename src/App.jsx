import { useState } from 'react'
import Splash from './components/Splash'
import { ProductionForm, PackingForm, DowntimeForm } from './components/Forms'

function App() {
  const [loadingDone, setLoadingDone] = useState(false)
  const [activeTab, setActiveTab] = useState('production')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {!loadingDone && (
        <Splash onDone={() => setLoadingDone(true)} imageUrl="/profile.jpg" />
      )}

      <header className="relative z-10 px-6 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Production Daily Count</h1>
        <p className="text-blue-300/80 text-sm">Data is saved to the backend and exported per shift</p>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        <div className="flex gap-2 mb-6 bg-slate-800/40 p-1 rounded-lg border border-blue-500/10 w-full max-w-xl">
          <button
            className={`flex-1 px-4 py-2 rounded-md ${activeTab==='production' ? 'bg-blue-600' : 'hover:bg-slate-700/50'}`}
            onClick={() => setActiveTab('production')}
          >Production</button>
          <button
            className={`flex-1 px-4 py-2 rounded-md ${activeTab==='packing' ? 'bg-blue-600' : 'hover:bg-slate-700/50'}`}
            onClick={() => setActiveTab('packing')}
          >Packing</button>
          <button
            className={`flex-1 px-4 py-2 rounded-md ${activeTab==='downtime' ? 'bg-blue-600' : 'hover:bg-slate-700/50'}`}
            onClick={() => setActiveTab('downtime')}
          >Downtimes</button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
          {activeTab === 'production' && <ProductionForm />}
          {activeTab === 'packing' && <PackingForm />}
          {activeTab === 'downtime' && <DowntimeForm />}
        </div>
      </main>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />

      <style>{`
        @keyframes loadingBar { 0%{transform:translateX(-100%)} 100%{transform:translateX(0%)} }
        .animate-loading-bar { animation: loadingBar 5s linear forwards }
        @keyframes fadeIn { from{opacity:0; transform: translateY(10px)} to{opacity:1; transform:none} }
        .animate-fade-in { animation: fadeIn .6s ease-out both }
      `}</style>
    </div>
  )
}

export default App
