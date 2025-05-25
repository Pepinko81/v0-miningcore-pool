import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="background-overlay"></div>
      <div className="text-center">
        <div className="logo mb-4">404</div>
        <div className="subtitle mb-8">Page Not Found</div>
        <div className="text-hashmatrix-cyan mb-8">The page you are looking for does not exist.</div>
        <Link
          href="/"
          className="inline-block bg-hashmatrix-gold text-black px-6 py-3 rounded-lg font-bold hover:bg-hashmatrix-orange transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
