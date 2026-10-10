"use client"

import Image from "next/image"
import { FaArrowRight, FaCamera, FaGem, FaFilePdf, FaCheckCircle } from "react-icons/fa"

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

const DETAILS = [
    {
        title: "Setting & construction",
        desc: "Prong, bezel and halo work, metal thickness and finishing quality.",
    },
    {
        title: "Stone & cut",
        desc: "Stone shape, cut, symmetry and how the stones are arranged across the piece.",
    },
    {
        title: "Metal & purity",
        desc: "Colour and finish used to estimate gold type and purity.",
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

const TRUST = ["GPT-4o Vision", "Camera or upload", "Certificate-ready PDF", "Local history"]

export default function Landing({ onStart }: { onStart: () => void }) {
    return (
        <div>
            {/* hero */}
            <section className="mx-auto grid items-center gap-14 px-6 md:px-10 py-16 pb-24 md:py-24 md:pb-28 lg:grid-cols-2">
                <div className="animate-fade-in">
                    <p className="mb-6 text-sm font-medium tracking-wide text-brand">AI jewellery appraisal</p>
                    <h1 className="font-serif text-6xl leading-[1.02] tracking-tight md:text-8xl">
                        Turn your camera into an expert <em className="text-brand">appraiser.</em>
                    </h1>
                    <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
                        Using GPT-4o Vision, GemSight identifies fine details and generates professional,
                        certificate-ready PDF reports instantly.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-5">
                        <button onClick={onStart} className="btn-primary h-12 px-7 text-base cursor-pointer">
                            Analyze a piece
                            <FaArrowRight className="text-xs" />
                        </button>
                        <a href="#how-it-works" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
                            See how it works
                        </a>
                    </div>
                </div>

                {/* square photo with a sample report card */}
                <div className="relative animate-fade-in" style={{ animationDelay: "0.15s" }}>
                    <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-line bg-ink shadow-[0_30px_60px_-30px_rgba(28,26,23,0.45)]">
                        <Image
                            src="/hero-necklace.jpg"
                            alt="Diamond necklace on a velvet cushion"
                            fill
                            priority
                            sizes="(min-width: 1024px) 560px, 100vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="absolute -bottom-8 -right-4 hidden w-64 rounded-2xl bg-card p-5 text-ink shadow-[0_24px_50px_-20px_rgba(0,0,0,0.45)] ring-1 ring-line sm:block">
                        <div className="flex items-center justify-between">
                            <span className="font-serif text-xl">Appraisal report</span>
                            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">Sample</span>
                        </div>
                        <dl className="mt-4 divide-y divide-line text-sm">
                            {[
                                ["Category", "Necklace"],
                                ["Segment", "Bridal / luxury"],
                                ["Metal", "18K gold"],
                                ["Setting", "Halo, prong-set"],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between py-2">
                                    <dt className="text-muted">{k}</dt>
                                    <dd className="font-medium">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-paper px-3 py-2 text-sm">
                            <FaCheckCircle className="text-brand" />
                            <span>Confidence: <strong className="font-semibold">High</strong></span>
                        </div>
                    </div>
                </div>
            </section>

            {/* trust strip */}
            <section className="border-b border-line bg-card">
                <ul className="mx-auto flex flex-wrap justify-between gap-x-8 gap-y-3 px-6 md:px-10 py-5 text-sm text-muted">
                    {TRUST.map((t) => (
                        <li key={t} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                            {t}
                        </li>
                    ))}
                </ul>
            </section>

            {/* details */}
            <section className="w-full px-6 md:px-10 py-20">
                <div className="max-w-2xl">
                    <h2 className="font-serif text-4xl tracking-tight md:text-5xl">It looks where an appraiser looks.</h2>
                    <p className="mt-4 text-muted">
                        GemSight inspects the small things that decide a piece&rsquo;s category and value.
                    </p>
                </div>
                <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
                    {DETAILS.map((d) => (
                        <div key={d.title} className="bg-card p-8">
                            <span className="mb-5 block h-0.5 w-8 bg-gold" aria-hidden />
                            <p className="font-serif text-2xl">{d.title}</p>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{d.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* how it works */}
            <section id="how-it-works" className="scroll-mt-4 border-y border-line bg-card">
                <div className="w-full px-6 md:px-10 py-20">
                    <h2 className="font-serif text-4xl tracking-tight md:text-5xl">From photo to certificate.</h2>
                    <ol className="mt-12 grid gap-12 md:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <li key={step.title} className="relative border-t border-ink pt-6">
                                <span className="font-serif text-5xl text-gold tabular-nums">0{i + 1}</span>
                                <div className="mt-4 flex items-center gap-2.5">
                                    <span className="text-brand">{step.icon}</span>
                                    <h3 className="text-lg font-semibold">{step.title}</h3>
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* features */}
            <section className="w-full px-6 md:px-10 py-20">
                <h2 className="font-serif text-4xl tracking-tight md:text-5xl">Built for the showroom floor.</h2>
                <p className="mt-4 max-w-2xl text-muted">
                    Bring consistency, clarity, and craftsmanship into your jewellery catalog, from design
                    identification to collection placement in one workflow.
                </p>
                <dl className="mt-12 grid border-t border-line md:grid-cols-2">
                    {FEATURES.map((f, i) => (
                        <div
                            key={f.title}
                            className={`border-b border-line py-7 ${i % 2 === 0 ? "md:pr-12" : "md:border-l md:pl-12"}`}
                        >
                            <dt className="font-semibold">{f.title}</dt>
                            <dd className="mt-1.5 text-sm leading-relaxed text-muted">{f.desc}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* closing call to action */}
            <section className="bg-brand text-white">
                <div className="mx-auto flex flex-col items-start justify-between gap-6 px-6 md:px-10 py-16 md:flex-row md:items-center">
                    <h2 className="max-w-xl font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                        Appraise your first piece in under a minute.
                    </h2>
                    <button
                        onClick={onStart}
                        className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-white px-7 text-base font-medium text-brand transition-colors hover:bg-[#f3efe6] cursor-pointer"
                    >
                        Start appraisal
                        <FaArrowRight className="text-xs" />
                    </button>
                </div>
            </section>
        </div>
    )
}
