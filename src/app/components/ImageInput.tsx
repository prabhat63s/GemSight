"use client"

import { useState } from "react"
import { FaCloudUploadAlt } from "react-icons/fa"

export default function ImageInput({
    onSelect,
    compact = false
}: {
    onSelect: (base64: string) => void
    compact?: boolean
}) {
    const [isDragging, setIsDragging] = useState(false)

    const handleFile = (file: File) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64 = reader.result
                ?.toString()
                .split(",")[1]
            if (base64) onSelect(base64)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div
            className={`relative group cursor-pointer rounded-xl border border-dashed transition-colors ${isDragging ? 'border-brand bg-brand-soft' : 'border-[#cfc8b9] bg-paper hover:border-brand hover:bg-brand-soft/50'
                }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFile(e.dataTransfer.files[0])
                }
            }}
        >
            <input
                type="file"
                accept="image/*"
                capture="environment"
                aria-label="Upload jewellery image"
                className="absolute inset-0 z-20 cursor-pointer opacity-0"
                onChange={(e) =>
                    e.target.files && handleFile(e.target.files[0])
                }
            />

            {compact ? (
                <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-muted">
                    <FaCloudUploadAlt className="text-brand" />
                    Drop a new photo or <span className="font-medium text-ink underline underline-offset-2">browse</span>
                </div>
            ) : (
                <div className="flex flex-col items-center px-6 py-12 text-center">
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-card border border-line text-brand">
                        <FaCloudUploadAlt className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold">Upload a jewellery image</h3>
                    <p className="mt-1 text-sm text-muted">
                        Drag and drop or click to browse. Camera supported on mobile.
                    </p>
                    <p className="mt-3 text-xs text-muted">JPG, PNG or WEBP</p>
                </div>
            )}
        </div>
    )
}
