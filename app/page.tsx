"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Database, AlertTriangle } from "lucide-react"

interface PoolStats {
  poolHashrate?: number
  connectedMiners?: number
  validShares?: number
  invalidShares?: number
}

interface NetworkStats {
  networkHashrate?: number
  networkDifficulty?: number
  lastNetworkBlockTime?: number
  blockHeight?: number
}

interface Port {
  port: number
  difficulty?: number
  varDiff?: boolean
}

interface Pool {
  id: string
  coin?: string
  poolStats?: PoolStats
  networkStats?: NetworkStats
  ports?: Port[]
  poolFeePercent?: number
  paymentProcessing?: {
    minimumPayment?: number
  }
}

interface GlobalStats {
  totalHashrate: number
  totalMiners: number
  activePools: number
  totalPorts: number
}

export default function MiningDashboard() {
  const [pools, setPools] = useState<Pool[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalHashrate: 0,
    totalMiners: 0,
    activePools: 0,
    totalPorts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Configuration - update this with your actual API endpoint
  const API_BASE_URL = "https://hashmatrix.bg/api"
  const DOMAIN = "hashmatrix.bg"

  const formatHashrate = (hashrate: number): string => {
    if (!hashrate) return "0 H/s"

    const units = ["H/s", "KH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s"]
    let unitIndex = 0
    let value = hashrate

    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000
      unitIndex++
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`
  }

  const formatNumber = (num: number): string => {
    if (!num) return "0"
    return num.toLocaleString()
  }

  const formatUptime = (timestamp: number): string => {
    if (!timestamp) return "N/A"

    const now = Math.floor(Date.now() / 1000)
    const seconds = now - timestamp

    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h ago`
    if (hours > 0) return `${hours}h ${minutes}m ago`
    return `${minutes}m ago`
  }

  const calculateGlobalStats = (poolsData: Pool[]): GlobalStats => {
    return {
      totalHashrate: poolsData.reduce((sum, pool) => sum + (pool.poolStats?.poolHashrate || 0), 0),
      totalMiners: poolsData.reduce((sum, pool) => sum + (pool.poolStats?.connectedMiners || 0), 0),
      activePools: poolsData.filter((pool) => (pool.poolStats?.connectedMiners || 0) > 0).length,
      totalPorts: poolsData.reduce((sum, pool) => sum + (pool.ports?.length || 0), 0),
    }
  }

  const loadPoolData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching pool data from:", `${API_BASE_URL}/pools`)

      const response = await fetch(`${API_BASE_URL}/pools`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Raw API response:", data)

      let poolsData: Pool[] = []

      // Handle different response formats
      if (Array.isArray(data)) {
        poolsData = data
      } else if (data.pools && typeof data.pools === "object") {
        poolsData = Object.entries(data.pools).map(([key, value]) => ({
          id: key,
          ...(value as any),
        }))
      } else if (data && typeof data === "object") {
        poolsData = [{ id: "default", ...data }]
      }

      console.log("Processed pools data:", poolsData)

      setPools(poolsData)
      setGlobalStats(calculateGlobalStats(poolsData))
      setLastUpdate(new Date())
    } catch (err) {
      console.error("Error loading pool data:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPoolData()
    const interval = setInterval(loadPoolData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Create floating elements effect
  useEffect(() => {
    const createFloatingElements = () => {
      for (let i = 0; i < 20; i++) {
        const element = document.createElement("div")
        element.className = "floating-element"
        element.style.cssText = `
          position: fixed;
          width: ${Math.random() * 4 + 1}px;
          height: ${Math.random() * 4 + 1}px;
          background-color: rgba(255, 193, 7, ${Math.random() * 0.3});
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          animation: float ${Math.random() * 10 + 5}s infinite linear;
          z-index: -1;
        `
        document.body.appendChild(element)
      }
    }
    createFloatingElements()
  }, [])

  if (loading && pools.length === 0) {
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

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="background-overlay"></div>

      {/* Header */}
      <div className="header">
        <div className="logo">HASHMATRIX</div>
        <div className="subtitle">Solo Mining Pools</div>
        {lastUpdate && (
          <div className="text-hashmatrix-cyan text-sm mt-2 opacity-75">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="container mx-auto px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <strong>Failed to load pool data</strong>
              <br />
              <small>Error: {error}</small>
              <br />
              <small>Please check if the API endpoint is accessible</small>
            </div>
          </div>
        )}

        {/* Global Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Hashrate</div>
            <div className="stat-value">{formatHashrate(globalStats.totalHashrate)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Miners</div>
            <div className="stat-value">{formatNumber(globalStats.totalMiners)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Active Pools</div>
            <div className="stat-value">
              {globalStats.activePools} / {pools.length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Ports</div>
            <div className="stat-value">{globalStats.totalPorts}</div>
          </div>
        </div>

        {/* Pool Cards */}
        <div id="content">
          {pools.length > 0 ? (
            <div className="pools-grid">
              {pools.map((pool) => (
                <div key={pool.id} className="pool-card">
                  <div className="pool-header">
                    <div className="pool-name">
                      {pool.id.toUpperCase()} {pool.coin && `(${pool.coin})`}
                    </div>
                    <div className="pool-status">
                      <div className="status-dot"></div>
                      <span>Online</span>
                    </div>
                  </div>

                  <div className="pool-metrics">
                    <div className="metric">
                      <div className="metric-label">Pool Hashrate</div>
                      <div className="metric-value">{formatHashrate(pool.poolStats?.poolHashrate || 0)}</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Connected Miners</div>
                      <div className="metric-value">{formatNumber(pool.poolStats?.connectedMiners || 0)}</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Network Hashrate</div>
                      <div className="metric-value">{formatHashrate(pool.networkStats?.networkHashrate || 0)}</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Network Difficulty</div>
                      <div className="metric-value">{formatNumber(pool.networkStats?.networkDifficulty || 0)}</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Last Block</div>
                      <div className="metric-value">
                        {pool.networkStats?.lastNetworkBlockTime
                          ? formatUptime(pool.networkStats.lastNetworkBlockTime)
                          : "N/A"}
                      </div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Block Height</div>
                      <div className="metric-value">{formatNumber(pool.networkStats?.blockHeight || 0)}</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Pool Fee</div>
                      <div className="metric-value">
                        {pool.poolFeePercent ? `${(pool.poolFeePercent * 100).toFixed(1)}%` : "N/A"}
                      </div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Min Payout</div>
                      <div className="metric-value">{pool.paymentProcessing?.minimumPayment || "N/A"}</div>
                    </div>
                  </div>

                  {/* Connection Info */}
                  {pool.ports && pool.ports.length > 0 && (
                    <div className="connection-info">
                      <div className="connection-title">🔗 Connection Details</div>
                      <div className="connection-details">
                        {pool.ports.map((port, index) => (
                          <div key={index} className="connection-item">
                            <span className="connection-label">
                              {port.difficulty ? `Diff ${formatNumber(port.difficulty)}` : "Auto"}
                            </span>
                            <span className="connection-value">
                              {DOMAIN}:{port.port}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="error">
                <Database className="w-12 h-12 mx-auto mb-4" />
                ⚠️ No pool data available
                <br />
                <small>Please check if the API endpoint is accessible</small>
              </div>
            )
          )}
        </div>

        {/* Refresh Button */}
        <button onClick={loadPoolData} disabled={loading} className="refresh-btn" title="Refresh Data">
          <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  )
}
