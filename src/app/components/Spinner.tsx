export default function Spinner() {
    return (
        <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-full w-full animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
            <div className="absolute h-8 w-8 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500 [animation-duration:1.5s] [animation-direction:reverse]" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
    )
}

