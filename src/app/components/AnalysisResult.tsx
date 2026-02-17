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
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Confidence Level:</span>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${metadata.confidence === 'High' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                metadata.confidence === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                    'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {metadata.confidence}
                        </span>
                    </div>
                )}

                {metadata?.verification?.isVerified && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Verified By:</span>
                        <div className="flex flex-wrap gap-1">
                            {metadata.verification.sources.map((source, idx) => (
                                <span key={idx} className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    {source}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="space-y-8 text-zinc-300 leading-relaxed">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-3xl font-black text-white print:text-zinc-900 mb-6 flex items-center gap-3 border-b border-white/5 print:border-zinc-200 pb-4">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                {children}
                            </h1>
                        ),
                        h2: ({ children }) => {
                            const text = String(children).toLowerCase()
                            let icon = <FaInfoCircle className="text-cyan-400" />

                            if (text.includes('market')) icon = <FaChartLine className="text-purple-400" />
                            if (text.includes('product')) icon = <FaGem className="text-cyan-400" />
                            if (text.includes('value')) icon = <FaChartLine className="text-green-400" />
                            if (text.includes('business')) icon = <FaListUl className="text-yellow-400" />

                            return (
                                <h2 className="text-xl font-bold text-white print:text-zinc-900 mb-6 flex items-center gap-3 bg-white/5 print:bg-zinc-50 w-fit px-6 py-2 rounded-xl border border-white/5 print:border-zinc-200">
                                    <span className="print:hidden">{icon}</span>
                                    {children}
                                </h2>
                            )
                        },
                        h3: ({ children }) => (
                            <h3 className="text-lg font-bold text-zinc-100 print:text-zinc-800 mt-8 mb-4 flex items-center gap-2">
                                <div className="h-1 w-4 rounded-full bg-linear-to-r from-purple-500 to-cyan-500 print:bg-purple-500" />
                                {children}
                            </h3>
                        ),
                        p: ({ children }) => (
                            <p className="text-zinc-400 print:text-zinc-600 mb-4 leading-relaxed text-sm md:text-base">
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
                                <span className="text-sm text-zinc-400 print:text-zinc-600">{children}</span>
                            </li>
                        ),
                        table: ({ children }) => (
                            <div className="my-8 overflow-hidden rounded-xl border border-white/10 print:border-zinc-200 bg-white/2 print:bg-white shadow-2xl print:shadow-none">
                                <table className="w-full text-left text-sm">
                                    {children}
                                </table>
                            </div>
                        ),
                        thead: ({ children }) => (
                            <thead className="bg-white/5 print:bg-zinc-100 text-zinc-300 print:text-zinc-700 uppercase text-[10px] tracking-widest font-bold">
                                {children}
                            </thead>
                        ),
                        th: ({ children }) => (
                            <th className="px-6 py-4 border-b border-white/10 print:border-zinc-200">
                                {children}
                            </th>
                        ),
                        td: ({ children }) => (
                            <td className="px-6 py-4 border-b border-white/5 print:border-zinc-100 text-zinc-400 print:text-zinc-600">
                                {children}
                            </td>
                        ),
                        strong: ({ children }) => (
                            <strong className="font-bold text-zinc-200 print:text-zinc-900">
                                {children}
                            </strong>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-purple-500 bg-purple-500/5 print:bg-zinc-50 p-6 rounded-r-3xl italic text-zinc-300 print:text-zinc-700 my-8">
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
