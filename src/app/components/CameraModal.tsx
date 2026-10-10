"use client"

import { useRef, useState, useEffect } from "react"
import { FaCamera, FaTimes, FaSync } from "react-icons/fa"

export default function CameraModal({
    onCapture,
    onClose
}: {
    onCapture: (base64: string) => void
    onClose: () => void
}) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

    const startCamera = async () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
        }

        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode }
            })
            setStream(newStream)
            if (videoRef.current) {
                videoRef.current.srcObject = newStream
            }
            setError(null)
        } catch (err) {
            console.error("Error accessing camera:", err)
            setError("Could not access camera. Please ensure you have granted permissions.")
        }
    }

    useEffect(() => {
        startCamera()
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [facingMode])

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas")
            canvas.width = videoRef.current.videoWidth
            canvas.height = videoRef.current.videoHeight
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0)
                const base64 = canvas.toDataURL("image/jpeg").split(",")[1]
                onCapture(base64)
                onClose()
            }
        }
    }

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 animate-fade-in">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-card border border-line shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                    <h3 className="font-serif text-2xl flex items-center gap-3">
                        <FaCamera className="text-brand text-base" />
                        Capture Jewellery
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-muted hover:bg-paper hover:text-ink transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Camera View */}
                <div className="relative aspect-video bg-black flex items-center justify-center">
                    {error ? (
                        <div className="p-8 text-center">
                            <p className="text-red-300 mb-4">{error}</p>
                            <button
                                onClick={startCamera}
                                className="rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="h-full w-full object-cover"
                        />
                    )}

                    {/* Overlay Grid */}
                    {!error && (
                        <div className="pointer-events-none absolute inset-0 border-[40px] border-black/20">
                            <div className="h-full w-full border border-white/20 rounded-2xl flex items-center justify-center">
                                <div className="h-32 w-32 border border-dashed border-white/40 rounded-full" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-8 flex items-center justify-center gap-8">
                    <button
                        onClick={toggleCamera}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted hover:bg-paper hover:text-ink transition-colors"
                        title="Switch Camera" aria-label="Switch camera"
                    >
                        <FaSync />
                    </button>

                    <button
                        onClick={capturePhoto}
                        disabled={!!error}
                        className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-card p-1 border border-line shadow-lg transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="h-full w-full rounded-full border-4 border-brand/20 flex items-center justify-center">
                            <div className="h-14 w-14 rounded-full bg-brand transition-transform group-hover:scale-105" />
                        </div>
                    </button>

                    <div className="w-12" /> {/* Spacer to balance toggle button */}
                </div>

                <div className="pb-6 text-center">
                    <p className="text-xs text-muted">Position the jewellery piece within the center circle for best results.</p>
                </div>
            </div>
        </div>
    )
}
