"use client"

import { useState } from "react"
import Landing from "./components/Landing"
import Analyzer from "./components/Analyzer"

export default function Home() {
  const [view, setView] = useState<'landing' | 'analyzer'>('landing')

  const handleStart = () => {
    setView('analyzer')
  }

  return (
    <main className="min-h-screen w-full bg-[#0e1117] text-white">
      {view === 'landing' && <Landing onStart={handleStart} />}

      {view === 'analyzer' && <Analyzer onBack={() => setView('landing')} />}

      {/* footer */}
      <footer className="bg-[#0e1117] text-white">
        <div className="max-w-7xl mx-auto p-6">
          <p className="text-center text-sm text-zinc-500">© {new Date().getFullYear()} <a href="https://prabhat-singh-portfolio.vercel.app" className="underline hover:text-white transition-colors">Prabhat Singh</a> . All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

