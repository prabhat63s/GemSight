"use client"

import { useState, useEffect } from "react"
import ImageInput from "./ImageInput"
import Spinner from "./Spinner"
import AnalysisResult from "./AnalysisResult"
import CameraModal from "./CameraModal"
import { FaMagic, FaDownload, FaImage, FaArrowLeft, FaHistory, FaCamera } from "react-icons/fa"

interface HistoryItem {
    id: string
    image: string
    result: string
    metadata?: any
    date: string
}

export default function Analyzer({ onBack }: { onBack?: () => void }) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState("")
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [isCameraOpen, setIsCameraOpen] = useState(false)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    const handleExportPDF = async () => {
        if (!result || !selectedImage) return;

        setIsGeneratingPDF(true);
        try {
            const response = await fetch('/api/export-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    result,
                    image: selectedImage,
                    date: new Date().toLocaleDateString(),
                    reportId: Math.random().toString(36).substr(2, 9).toUpperCase()
                }),
            });

            if (!response.ok) throw new Error('Failed to generate PDF');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Jewellery-Analysis-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("PDF generation failed:", error);
            window.print();
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    useEffect(() => {
        const savedHistory = localStorage.getItem("jewellery_history")
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }, [])

    const saveToHistory = (image: string, res: string, metadata?: any) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            image,
            result: res,
            metadata,
            date: new Date().toLocaleString()
        }
        const updatedHistory = [newItem, ...history].slice(0, 5)
        setHistory(updatedHistory)
        localStorage.setItem("jewellery_history", JSON.stringify(updatedHistory))
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem("jewellery_history")
    }

    const [analysisMetadata, setAnalysisMetadata] = useState<any>(null)

    const analyze = async (imageBase64: string) => {
        setLoading(true)
        setResult("")
        setAnalysisMetadata(null)
        const imageUrl = `data:image/jpeg;base64,${imageBase64}`
        setSelectedImage(imageUrl)

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                body: JSON.stringify({ imageBase64 })
            })

            const data = await res.json()
            if (data.success) {
                setResult(data.analysis)
                setAnalysisMetadata(data.metadata)
                saveToHistory(imageUrl, data.analysis, data.metadata)
            } else {
                throw new Error(data.error || "Analysis failed")
            }
        } catch (error) {
            console.error("Analysis failed:", error)
            setResult("### Analysis Error\nWe encountered an issue while processing your image. Please ensure the file is a valid image and try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-mesh py-12 px-4 md:px-8 lg:px-12">
            <div className="mx-auto max-w-8xl">
                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="mb-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors animate-fade-in"
                    >
                        <FaArrowLeft className="text-xs" /> Back to Home
                    </button>
                )}

                {/* Header Section */}
                <header className="mb-16 text-center animate-fade-in">
                    <h1 className="text-4xl font-bold gradient-text md:text-6xl lg:text-7xl tracking-tight">
                        Jewellery Intelligence
                    </h1>
                    <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto">
                        Upload your high-resolution jewellery images for instant, expert-level metadata generation and market analysis.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Left Column: Controls & History (4 cols) */}
                    <div className="lg:col-span-4 space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <section className="glass rounded-2xl p-8 border border-white/5">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
                                        <FaImage />
                                    </div>
                                    Input Source
                                </h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsCameraOpen(true)}
                                        className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
                                    >
                                        <FaCamera /> Camera
                                    </button>
                                    {selectedImage && (
                                        <button
                                            onClick={() => { setSelectedImage(null); setResult(""); }}
                                            className="text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                                        >
                                            CLEAR
                                        </button>
                                    )}
                                </div>
                            </div>

                            <ImageInput onSelect={analyze} />

                            {selectedImage && (
                                <div className="mt-6 h-[380px] w-[380px] max-w-full mx-auto relative group overflow-hidden rounded-2xl border border-white/10 aspect-square shadow-2xl">
                                    <img
                                        src={selectedImage}
                                        alt="Selected piece"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-4 left-4 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Source Image Preview
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="glass-card rounded-2xl p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    <FaHistory className="text-purple-400" />
                                    Recent Analyses
                                </h3>
                                {history.length > 0 && (
                                    <button
                                        onClick={clearHistory}
                                        className="text-[10px] uppercase tracking-wider text-zinc-600 hover:text-red-400 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {history.length === 0 ? (
                                <p className="text-sm text-zinc-600 italic text-center py-4">No recent history</p>
                            ) : (
                                <div className="space-y-4 h-40 overflow-y-auto">
                                    {history.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setSelectedImage(item.image)
                                                setResult(item.result)
                                                setAnalysisMetadata(item.metadata)
                                            }}
                                            className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all text-left group"
                                        >
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                                                <img src={item.image} alt="History" className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-zinc-300 truncate">Analysis {item.date}</p>
                                                <p className="text-[10px] text-zinc-500">Click to view report</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Results (8 cols) */}
                    <div className="lg:col-span-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="glass min-h-[760px] rounded-2xl p-8 border border-white/5 relative overflow-hidden">
                            {/* Decorative background glow */}
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-600/5 blur-[100px]" />

                            <div className="relative z-10">
                                <div className="mb-10 flex pb-4 border-b border-white/5 items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600/20 text-cyan-400">
                                            <FaMagic />
                                        </div>
                                        Analysis Report
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        {result && (
                                            <>
                                                <button
                                                    onClick={() => { setSelectedImage(null); setResult(""); }}
                                                    className="flex items-center gap-2 rounded-xl bg-purple-600/20 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-600/30 transition-all border border-purple-500/20"
                                                >
                                                    <FaImage className="text-xs" /> New Analysis
                                                </button>
                                                <button
                                                    onClick={handleExportPDF}
                                                    disabled={isGeneratingPDF}
                                                    className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isGeneratingPDF ? (
                                                        <>
                                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-white" />
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaDownload className="text-xs" /> Export PDF
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {!loading && !result && (
                                    <div className="flex h-[450px] flex-col items-center justify-center text-center">
                                        <div className="mb-8 rounded-4xl bg-white/5 p-10 border border-white/5 animate-float">
                                            <svg className="h-16 w-16 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-zinc-400 mb-2">Awaiting Input</h3>
                                        <p className="text-zinc-600 max-w-xs">Upload a jewellery image to begin the automated appraisal process.</p>
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex h-[450px] flex-col items-center justify-center">
                                        <div className="relative">
                                            <Spinner />
                                            <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/20" />
                                        </div>
                                        <p className="mt-10 text-lg font-medium text-purple-400 animate-pulse">
                                            Synthesizing Visual Data...
                                        </p>
                                    </div>
                                )}

                                {result && (
                                    <div className="animate-fade-in space-y-6">
                                        <AnalysisResult
                                            content={result}
                                            metadata={{
                                                confidence: analysisMetadata?.confidenceScore >= 0.85 ? 'High' : analysisMetadata?.confidenceScore >= 0.6 ? 'Medium' : 'Low'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Camera Modal */}
            {isCameraOpen && (
                <CameraModal
                    onCapture={analyze}
                    onClose={() => setIsCameraOpen(false)}
                />
            )}
        </div>
    )
}
