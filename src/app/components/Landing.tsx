"use client"

import Image from "next/image"
import { FaArrowRight, FaCamera, FaGem, FaFilePdf } from "react-icons/fa"

const STEPS = [
    {
        icon: <FaCamera />,
        title: "Capture",
        desc: "Take a photo with your camera or upload a high-resolution image of the piece.",
    },
    {
        icon: <FaGem />,
        title: "Analyze",
        desc: "GPT-4o Vision identifies the category, metal, stones, setting and construction details.",
    },
    {
        icon: <FaFilePdf />,
        title: "Report",
        desc: "Download a professional, certificate-ready PDF with the value assessment and notes.",
    },
]

const FEATURES = [
    {
        title: "Design & material identification",
        desc: "Clear identification of jewellery category, materials, and visible design elements.",
    },
    {
        title: "Catalog consistency",
        desc: "Uniform descriptions and classifications across your entire inventory.",
    },
    {
        title: "Smart categorization",
        desc: "Organize products by collection, occasion, and regional design influence.",
    },
    {
        title: "Enterprise-ready records",
        desc: "Structured outputs designed for large-scale jewellery operations and reporting.",
    },
]

export default function Landing({ onStart }: { onStart: () => void }) {
    return (
        <div>
            {/* hero */}
            <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
                <div className="animate-fade-in">
                    <p className="mb-5 text-sm font-medium text-brand">AI jewellery appraisal</p>
                    <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
                        Turn your camera into an expert appraiser.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        Using GPT-4o Vision, GemSight identifies fine details and generates professional,
                        certificate-ready PDF reports instantly.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        <button onClick={onStart} className="btn-primary h-12 px-7 text-base cursor-pointer">
                            Analyze a piece
                            <FaArrowRight className="text-xs" />
                        </button>
                        <span className="text-sm text-muted">Upload a photo or use your camera</span>
                    </div>
                </div>

                <div className="relative animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-card p-3 shadow-[0_20px_50px_-30px_rgba(28,26,23,0.35)]">
                        <div className="relative h-full w-full overflow-hidden rounded-2xl">
                            <Image
                                src="/hero-bg.png"
                                alt="Jewellery"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* how it works */}
            <section className="border-t border-line bg-card">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <h2 className="font-serif text-4xl tracking-tight">How it works</h2>
                    <ol className="mt-10 grid gap-10 md:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <li key={step.title}>
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                                        {step.icon}
                                    </span>
                                    <span className="text-sm text-muted tabular-nums">Step {i + 1}</span>
                                </div>
                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.desc}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* features */}
            <section className="mx-auto max-w-7xl px-6 py-16">
                <h2 className="font-serif text-4xl tracking-tight">Built for the showroom floor</h2>
                <p className="mt-3 max-w-2xl text-muted">
                    Bring consistency, clarity, and craftsmanship into your jewellery catalog, from design
                    identification to collection placement in one workflow.
                </p>
                <dl className="mt-10 grid border-t border-line md:grid-cols-2">
                    {FEATURES.map((f, i) => (
                        <div
                            key={f.title}
                            className={`border-b border-line py-6 ${i % 2 === 0 ? "md:pr-10" : "md:border-l md:pl-10"}`}
                        >
                            <dt className="font-semibold">{f.title}</dt>
                            <dd className="mt-1 text-sm leading-relaxed text-muted">{f.desc}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </div>
    )
}
