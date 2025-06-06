"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="background-overlay"></div>
      <div className="text-center">
        <div className="logo mb-4">Error</div>
        <div className="subtitle mb-8">Something went wrong!</div>
        <div className="text-hashmatrix-cyan mb-8">{error.message || "An unexpected error occurred"}</div>
        <button
          onClick={reset}
          className="inline-block bg-hashmatrix-gold text-black px-6 py-3 rounded-lg font-bold hover:bg-hashmatrix-orange transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
