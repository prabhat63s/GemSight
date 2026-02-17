"use client"

import { useState } from "react"
import { FaCloudUploadAlt } from "react-icons/fa"

export default function ImageInput({
    onSelect
}: {
    onSelect: (base64: string) => void
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
            className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragging ? 'border-purple-500 bg-purple-500/10 scale-[0.99]' : 'border-white/10 hover:border-purple-500/50 hover:bg-white/5'
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
                className="absolute inset-0 z-20 cursor-pointer opacity-0"
                onChange={(e) =>
                    e.target.files && handleFile(e.target.files[0])
                }
            />

            <div className="flex items-center justify-center pt-16 p-6 text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/20" />
                    <div className="relative rounded-2xl bg-purple-600/20 p-5 transition-transform group-hover:scale-110 group-hover:rotate-3">
                        <FaCloudUploadAlt className="h-6 w-6 text-purple-400" />
                    </div>
                </div>
                <div className="flex flex-col items-center">

                <h3 className="text-lg font-bold text-white mb-2">Upload Jewellery Image</h3>
                <p className="text-sm text-zinc-500">
                    Drag and drop or click to browse. Camera supported on mobile.
                </p>
                <div className="mt-3 flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 border border-white/5">
                    JPG • PNG • WEBP
                </div>
                </div>
            </div>
        </div>
    )
}

