"use client"

import Image from "next/image"
import { FaDatabase, FaTags, FaSearch, FaFileAlt, FaArrowRight } from "react-icons/fa"

export default function Landing({ onStart }: { onStart: () => void }) {
    return (
        <div className="relative pt-20 min-h-[90vh] w-full overflow-hidden bg-mesh flex flex-col items-center justify-center px-6 pb-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Jewellery Background"
                    fill
                    className="object-cover opacity-30"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-[#0e1117]" />
            </div>

            {/* Content */}
            <div className="relative z-10 md:max-w-7xl text-center animate-fade-in">
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
                    Precision for <br />
                    <span className="gradient-text">Every Jewellery Piece</span>
                </h1>

                <p className="mb-12 text-zinc-300 md:text-xl max-w-3xl mx-auto leading-relaxed">
                    Bring consistency, clarity, and craftsmanship into your jewellery catalog.
                    From design identification to collection placement all in one seamless workflow.
                </p>

                <div className="flex justify-center mb-24">
                    <button
                        onClick={onStart}
                        className="group relative flex h-16 items-center gap-4 rounded-full border border-white/10 bg-white/15 px-10 text-xl font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-[0_0_50px_10px_rgba(123,66,246,0.3)] active:scale-95"
                    >
                        <span>Analyze a Jewellery Piece</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-400 transition-transform group-hover:translate-x-1">
                            <FaArrowRight />
                        </div>
                        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-purple-500/20 transition-all group-hover:ring-purple-400/40" />
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Design & Material Identification",
                            desc: "Clear identification of jewellery category, materials, and visible design elements.",
                            icon: <FaFileAlt className="text-purple-400" />
                        },
                        {
                            title: "Catalog Consistency",
                            desc: "Ensure uniform descriptions and classifications across your entire inventory.",
                            icon: <FaSearch className="text-cyan-400" />
                        },
                        {
                            title: "Smart Categorization",
                            desc: "Organize products by collection, occasion, and regional design influence.",
                            icon: <FaTags className="text-pink-400" />
                        },
                        {
                            title: "Enterprise-Ready Records",
                            desc: "Structured outputs designed for large-scale jewellery operations and reporting.",
                            icon: <FaDatabase className="text-blue-400" />
                        }
                    ].map((feature, i) => (
                        <div key={i} className="glass-card rounded-3xl p-8 text-left border border-white/5">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-xl">
                                {feature.icon}
                            </div>
                            <h3 className="mb-3 text-lg font-bold text-white">{feature.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/4 left-10 h-64 w-64 rounded-full bg-purple-600/10 blur-[120px] animate-float" />
            <div className="absolute bottom-1/4 right-10 h-80 w-80 rounded-full bg-cyan-600/10 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        </div>
    )
}

