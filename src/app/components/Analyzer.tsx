"use client"

import { useState, useEffect } from "react"
import ImageInput from "./ImageInput"
import Spinner from "./Spinner"
import AnalysisResult from "./AnalysisResult"
import CameraModal from "./CameraModal"
import { FaDownload, FaImage, FaArrowLeft, FaHistory, FaCamera, FaGem } from "react-icons/fa"

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

    return (
        <div className="w-full px-6 md:px-10 py-10 md:py-14">
            <div>
                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors cursor-pointer"
                    >
                        <FaArrowLeft className="text-xs" /> Back to home
                    </button>
                )}

                {/* Header Section */}
                <header className="mb-10 animate-fade-in">
                    <h1 className="font-serif text-4xl tracking-tight md:text-5xl">
                        New appraisal
                    </h1>
                    <p className="mt-3 text-muted max-w-2xl">
                        Upload a clear photo of the piece, or capture one with your camera, to get an expert-level analysis and a certificate-ready report.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left Column: Controls & History (4 cols) */}
                    <div className="lg:col-span-4 space-y-6 animate-fade-in">
                        <section className="rounded-2xl border border-line bg-card p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="font-semibold flex items-center gap-2.5">
                                    <FaImage className="text-brand" />
                                    Photo
                                </h2>
                                <div className="flex items-center gap-4 text-sm">
                                    <button
                                        onClick={() => setIsCameraOpen(true)}
                                        className="flex items-center gap-1.5 font-medium text-brand hover:underline underline-offset-2 cursor-pointer"
                                    >
                                        <FaCamera className="text-xs" /> Use camera
                                    </button>
                                    {selectedImage && (
                                        <button
                                            onClick={() => { setSelectedImage(null); setResult(""); }}
                                            className="text-muted hover:text-ink transition-colors cursor-pointer"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            <ImageInput onSelect={analyze} />

                            {selectedImage && (
                                <div className="mt-5 aspect-square w-full overflow-hidden rounded-xl border border-line bg-paper">
                                    <img
                                        src={selectedImage}
                                        alt="Selected piece"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                        </section>

                        <section className="rounded-2xl border border-line bg-card p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold flex items-center gap-2.5">
                                    <FaHistory className="text-brand" />
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
                                <p className="text-sm text-muted py-4 text-center">No recent history</p>
                            ) : (
                                <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {history.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setSelectedImage(item.image)
                                                setResult(item.result)
                                                setAnalysisMetadata(item.metadata)
                                            }}
                                            className="w-full flex items-center gap-3 rounded-xl border border-transparent p-2 text-left hover:border-line hover:bg-paper transition-colors cursor-pointer"
                                        >
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line">
                                                <img src={item.image} alt="History" className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">Analysis {item.date}</p>
                                                <p className="text-xs text-muted">View report</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Results (8 cols) */}
                    <div className="lg:col-span-8 animate-fade-in">
                        <div className="min-h-[640px] rounded-2xl border border-line bg-card p-6 md:p-8">
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
                                <h2 className="font-serif text-3xl tracking-tight">
                                    Analysis report
                                </h2>
                                <div className="flex items-center gap-2">
                                    {result && (
                                        <>
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
                                        </>
                                    )}
                                </div>
                            </div>

                            {!loading && !result && (
                                <div className="flex h-[420px] flex-col items-center justify-center text-center">
                                    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                                        <FaGem className="text-xl" />
                                    </span>
                                    <h3 className="font-serif text-2xl">Awaiting a photo</h3>
                                    <p className="mt-2 max-w-xs text-sm text-muted">Add a jewellery image to start the appraisal. Your report will appear here.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex h-[420px] flex-col items-center justify-center">
                                    <Spinner />
                                    <p className="mt-6 text-sm text-muted">
                                        Examining the piece...
                                    </p>
                                </div>
                            )}

                            {result && (
                                <div className="animate-fade-in space-y-6">
                                    {selectedImage && (
                                        <div className="flex items-center gap-4 rounded-xl bg-paper p-4">
                                            <img src={selectedImage} alt="Appraised piece" className="h-20 w-20 shrink-0 rounded-lg border border-line object-cover" />
                                            <div className="min-w-0">
                                                <p className="font-serif text-xl leading-tight">Prepared by GemSight</p>
                                                <p className="mt-1 text-sm text-muted">{new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</p>
                                            </div>
                                        </div>
                                    )}
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
