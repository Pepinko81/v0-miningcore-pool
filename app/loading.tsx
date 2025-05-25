export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="background-overlay"></div>
      <div className="container mx-auto px-8 py-8">
        <div className="text-center">
          <div className="logo mb-4">HASHMATRIX</div>
          <div className="subtitle mb-8">Solo Mining Pools</div>
          <div className="loading">Loading pool data...</div>
        </div>
      </div>
    </div>
  )
}
