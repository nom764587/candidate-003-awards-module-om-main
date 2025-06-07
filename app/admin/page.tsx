"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [badgesLoading, setBadgesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [badgesError, setBadgesError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fetchRegistrations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/registrations", {
        headers: {
          "x-api-key": apiKey,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false)
          throw new Error("Unauthorized. Please check your API key.")
        }
        throw new Error("Failed to fetch registrations")
      }

      const data = await response.json()
      setRegistrations(data.registrations || [])
      setIsAuthenticated(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBadges = async () => {
    setBadgesLoading(true)
    setBadgesError(null)

    try {
      const response = await fetch("/api/badges", {
        headers: {
          "x-api-key": apiKey,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false)
          throw new Error("Unauthorized. Please check your API key.")
        }
        throw new Error("Failed to fetch badges")
      }

      const data = await response.json()
      setBadges(data || [])
    } catch (err: any) {
      setBadgesError(err.message)
    } finally {
      setBadgesLoading(false)
    }
  }

  const handleDeleteRegistration = async (regId: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/registrations?regId=${regId}`, {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete registration")
      }

      // Refresh registrations
      fetchRegistrations()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault()
    fetchRegistrations()
  }

  const handleDeleteBadge = async (badgeId: string) => {
    if (!confirm("Are you sure you want to delete this badge?")) {
      return
    }

    try {
      const response = await fetch(`/api/badges/${badgeId}`, {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete badge")
      }

      // Refresh badges
      fetchBadges()
    } catch (err: any) {
      setBadgesError(err.message)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations()
      fetchBadges()
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Summit Registration Admin</h1>

        {!isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">For demo purposes, use: admin-secret-key</p>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Authenticate
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Summit Registrations</h2>
                  <button
                    onClick={fetchRegistrations}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Refresh
                  </button>
                </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading registrations...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No registrations found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Influencer ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registered At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map((reg) => (
                        <tr key={reg.regId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.regId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.influencerId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.name || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(reg.registeredAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleDeleteRegistration(reg.regId)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete registration"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Badges</h2>
                  <button
                    onClick={fetchBadges}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Refresh
                  </button>
                </div>

                {badgesLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading badges...</p>
                  </div>
                ) : badgesError ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md">{badgesError}</div>
                ) : badges.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No badges found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Badge ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Influencer ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Badge
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Awarded At
                          </th>

                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {badges.map((badge) => (
                          <tr key={badge.badgeId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{badge.badgeId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{badge.influencerId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{badge.badge}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(badge.awardedAt).toLocaleString()}
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                <p className="font-semibold">Note:</p>
                <p>
                  This is a simple admin interface for demonstration purposes. In a production environment, I would
                  implement proper authentication, authorization, and additional features like filtering, sorting, and
                  pagination.
                </p>
              </div>
          </>
        )}
      </div>
    </div>
  )
}
