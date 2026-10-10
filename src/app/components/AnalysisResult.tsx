"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { FaCheck, FaGem, FaListUl, FaChartLine, FaInfoCircle } from "react-icons/fa"

export default function AnalysisResult({
    content,
    metadata
}: {
    content: string
    metadata?: {
        confidence?: string;
        verification?: {
            sources: string[];
            isVerified: boolean;
            method: string;
        }
    }
}) {
    return (
        <div className="relative group">
            <div className="mb-6 flex flex-wrap items-center gap-4">
                {metadata?.confidence && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">Confidence:</span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${metadata.confidence === 'High' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                metadata.confidence === 'Medium' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                                    'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {metadata.confidence}
                        </span>
                    </div>
                )}

                {metadata?.verification?.isVerified && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">Verified by:</span>
                        <div className="flex flex-wrap gap-1">
                            {metadata.verification.sources.map((source, idx) => (
                                <span key={idx} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-brand-soft text-brand border border-brand/20">
                                    {source}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="space-y-8 text-ink leading-relaxed">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className="font-serif text-4xl text-ink mb-6 flex items-center gap-3 border-b border-line pb-4">
                                <span className="h-2 w-2 rounded-full bg-brand" />
                                {children}
                            </h1>
                        ),
                        h2: ({ children }) => {
                            const text = String(children).toLowerCase()
                            let icon = <FaInfoCircle className="text-brand" />

                            if (text.includes('market')) icon = <FaChartLine className="text-brand" />
                            if (text.includes('product')) icon = <FaGem className="text-brand" />
                            if (text.includes('value')) icon = <FaChartLine className="text-brand" />
                            if (text.includes('business')) icon = <FaListUl className="text-gold" />

                            return (
                                <h2 className="text-lg font-semibold text-ink mb-5 flex items-center gap-3 bg-paper w-fit px-4 py-2 rounded-lg border border-line">
                                    <span className="print:hidden">{icon}</span>
                                    {children}
                                </h2>
                            )
                        },
                        h3: ({ children }) => (
                            <h3 className="text-base font-semibold text-ink mt-8 mb-3 flex items-center gap-2">
                                <div className="h-0.5 w-4 rounded-full bg-gold" />
                                {children}
                            </h3>
                        ),
                        p: ({ children }) => (
                            <p className="text-muted mb-4 leading-relaxed text-sm md:text-base">
                                {children}
                            </p>
                        ),
                        ul: ({ children }) => (
                            <ul className="flex flex-col gap-3 my-6">
                                {children}
                            </ul>
                        ),
                        li: ({ children }) => (
                            <li className="flex items-start gap-3">
                                <span className="text-sm text-muted">{children}</span>
                            </li>
                        ),
                        table: ({ children }) => (
                            <div className="my-6 overflow-hidden rounded-xl border border-line bg-card">
                                <table className="w-full text-left text-sm [&_tr:last-child_td]:border-b-0">
                                    {children}
                                </table>
                            </div>
                        ),
                        thead: ({ children }) => (
                            <thead className="bg-paper text-muted text-xs font-medium">
                                {children}
                            </thead>
                        ),
                        th: ({ children }) => (
                            <th className="px-5 py-3 border-b border-line">
                                {children}
                            </th>
                        ),
                        td: ({ children }) => (
                            <td className="px-5 py-3 border-b border-line text-ink">
                                {children}
                            </td>
                        ),
                        strong: ({ children }) => (
                            <strong className="font-semibold text-ink">
                                {children}
                            </strong>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-gold bg-paper p-5 rounded-r-lg text-ink my-6">
                                {children}
                            </blockquote>
                        )
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    )
}
