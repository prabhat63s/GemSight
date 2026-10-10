"use client"

import { useState, useEffect } from "react"
import ImageInput from "./ImageInput"
import Spinner from "./Spinner"
import AnalysisResult from "./AnalysisResult"
import CameraModal from "./CameraModal"
import { FaDownload, FaImage, FaArrowLeft, FaHistory, FaCamera, FaGem, FaTimes } from "react-icons/fa"

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
            a.download = `GemSight-Report-${Date.now()}.pdf`;
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

    const reportDate = new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })

    return (
        <div className="w-full px-6 md:px-10 py-8 md:py-12">
            {/* Page heading */}
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-fade-in">
                <div>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors cursor-pointer"
                        >
                            <FaArrowLeft className="text-xs" /> Back to home
                        </button>
                    )}
                    <h1 className="font-serif text-4xl tracking-tight md:text-5xl">New appraisal</h1>
                </div>
                <p className="max-w-md text-sm text-muted">
                    Add a clear photo of the piece. GemSight examines it and prepares a certificate-ready report.
                </p>
            </header>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
                {/* Left: photo + history */}
                <aside className="space-y-6 animate-fade-in lg:sticky lg:top-6">
                    <section className="rounded-2xl border border-line bg-card p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Photo</h2>
                            <button
                                onClick={() => setIsCameraOpen(true)}
                                className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline underline-offset-2 cursor-pointer"
                            >
                                <FaCamera className="text-xs" /> Use camera
                            </button>
                        </div>

                        {selectedImage ? (
                            <div className="space-y-3">
                                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-paper">
                                    <img
                                        src={selectedImage}
                                        alt="Selected piece"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        onClick={() => { setSelectedImage(null); setResult(""); }}
                                        aria-label="Remove photo"
                                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-ink shadow-sm hover:bg-card transition-colors cursor-pointer"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>
                                <ImageInput onSelect={analyze} compact />
                            </div>
                        ) : (
                            <ImageInput onSelect={analyze} />
                        )}
                    </section>

                    <section className="rounded-2xl border border-line bg-card p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-sm font-semibold">
                                <FaHistory className="text-xs text-brand" />
                                Recent analyses
                            </h3>
                            {history.length > 0 && (
                                <button
                                    onClick={clearHistory}
                                    className="text-xs text-muted hover:text-red-700 transition-colors cursor-pointer"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {history.length === 0 ? (
                            <p className="py-3 text-sm text-muted">Your last five analyses will appear here.</p>
                        ) : (
                            <div className="-mx-2 max-h-64 space-y-1 overflow-y-auto">
                                {history.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedImage(item.image)
                                            setResult(item.result)
                                            setAnalysisMetadata(item.metadata)
                                        }}
                                        className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-paper transition-colors cursor-pointer"
                                    >
                                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-line">
                                            <img src={item.image} alt="History" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{item.date}</p>
                                            <p className="text-xs text-muted">View report</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                </aside>

                {/* Right: report */}
                <section className="min-w-0 animate-fade-in">
                    {result && (
                        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
                            <button
                                onClick={() => { setSelectedImage(null); setResult(""); }}
                                className="btn-outline h-9 px-4 text-sm cursor-pointer"
                            >
                                <FaImage className="text-xs" /> New analysis
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={isGeneratingPDF}
                                className="btn-primary h-9 px-4 text-sm cursor-pointer"
                            >
                                {isGeneratingPDF ? (
                                    <>
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FaDownload className="text-xs" /> Export PDF
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* certificate sheet */}
                    <article className="relative min-h-[640px] rounded-2xl border border-line bg-card px-6 py-8 shadow-[0_24px_50px_-36px_rgba(28,26,23,0.4)] md:px-14 md:py-12 before:pointer-events-none before:absolute before:inset-3 before:rounded-xl before:border before:border-gold/30 before:content-['']">
                        <div className="relative">
                            <div className="flex items-start justify-between gap-6 border-b border-line pb-6">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
                                        <FaGem className="text-xs" />
                                    </span>
                                    <div>
                                        <p className="font-serif text-2xl leading-none">GemSight</p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Certificate of appraisal</p>
                                    </div>
                                </div>
                                {result && (
                                    <div className="flex items-center gap-4 text-right">
                                        <div>
                                            <p className="text-xs text-muted">Date</p>
                                            <p className="text-sm font-medium">{reportDate}</p>
                                        </div>
                                        {selectedImage && (
                                            <img src={selectedImage} alt="Appraised piece" className="h-14 w-14 rounded-lg border border-line object-cover" />
                                        )}
                                    </div>
                                )}
                            </div>

                            {!loading && !result && (
                                <div className="pt-10" aria-hidden={false}>
                                    <div className="space-y-4 opacity-60" aria-hidden>
                                        <div className="h-8 w-2/3 rounded bg-paper" />
                                        <div className="h-3 w-1/3 rounded bg-paper" />
                                        <div className="mt-8 h-3 w-full rounded bg-paper" />
                                        <div className="h-3 w-11/12 rounded bg-paper" />
                                        <div className="h-3 w-4/5 rounded bg-paper" />
                                        <div className="mt-8 h-24 w-full rounded-xl bg-paper" />
                                    </div>
                                    <p className="mt-10 text-center font-serif text-2xl">Your report will appear here</p>
                                    <p className="mt-1 text-center text-sm text-muted">Add a photo to begin the appraisal.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="pt-10">
                                    <div className="space-y-4 animate-pulse" aria-hidden>
                                        <div className="h-8 w-2/3 rounded bg-paper" />
                                        <div className="h-3 w-1/3 rounded bg-paper" />
                                        <div className="mt-8 h-3 w-full rounded bg-paper" />
                                        <div className="h-3 w-11/12 rounded bg-paper" />
                                        <div className="h-3 w-4/5 rounded bg-paper" />
                                        <div className="mt-8 h-24 w-full rounded-xl bg-paper" />
                                    </div>
                                    <div className="mt-10 flex items-center justify-center gap-3 text-sm text-muted" role="status">
                                        <Spinner />
                                        Examining the piece...
                                    </div>
                                </div>
                            )}

                            {result && (
                                <div className="animate-fade-in pt-8">
                                    <AnalysisResult
                                        content={result}
                                        metadata={{
                                            confidence: analysisMetadata?.confidenceScore >= 0.85 ? 'High' : analysisMetadata?.confidenceScore >= 0.6 ? 'Medium' : 'Low'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </article>
                </section>
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
