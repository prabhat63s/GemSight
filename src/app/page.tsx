"use client"

import { useState } from "react"
import { FaGem } from "react-icons/fa"
import Landing from "./components/Landing"
import Analyzer from "./components/Analyzer"

export default function Home() {
  const [view, setView] = useState<'landing' | 'analyzer'>('landing')

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper text-ink">
      {/* header */}
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-2.5 cursor-pointer"
            aria-label="GemSight home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
              <FaGem className="text-xs" />
            </span>
            <span className="font-serif text-2xl leading-none tracking-tight">GemSight</span>
          </button>

          {view === 'landing' && (
            <button onClick={() => setView('analyzer')} className="btn-primary h-9 px-5 text-sm cursor-pointer">
              Start appraisal
            </button>
          )}
        </div>
      </header>

      <main className="flex-1">
        {view === 'landing' && <Landing onStart={() => setView('analyzer')} />}

        {view === 'analyzer' && <Analyzer onBack={() => setView('landing')} />}
      </main>

      {/* footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm text-muted">
          <span className="font-serif text-lg text-ink">GemSight</span>
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a href="https://prabhat-singh-portfolio.vercel.app" className="underline underline-offset-2 hover:text-ink transition-colors">Prabhat Singh</a>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
