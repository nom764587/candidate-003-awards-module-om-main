import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">🏆 Influencer Awards Engine</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            A complete solution for influencer recognition and event management with embeddable widgets and RESTful APIs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Summit Registration</h2>
            <p className="text-gray-600 mb-6">
              Experience the Summit Registration Widget in action. Register for the exclusive FoodStory Summit event.
            </p>
            <Link
              href="/summit-demo.html"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Summit Demo →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏅 Badge System</h2>
            <p className="text-gray-600 mb-6">
              Try out the Badge Issuance & Notification System. Issue badges and see real-time notifications.
            </p>
            <Link
              href="/badge-demo.html"
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Badge Demo →
            </Link>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🚀 Implementation Features</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Embeddable Widgets</h3>
              <p className="text-gray-600 text-sm">Drop-in JavaScript widgets that work on any website</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Real-time Updates</h3>
              <p className="text-gray-600 text-sm">Instant notifications and live data synchronization</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure & Validated</h3>
              <p className="text-gray-600 text-sm">Input validation and comprehensive error handling</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔌 API Documentation</h2>
            <p className="text-gray-600 mb-6">
              RESTful API endpoints for summit registration and badge management with JSON responses.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">POST /api/summit/register</code>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">POST /api/badges/issue</code>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">GET /api/badges</code>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Admin Panel</h2>
            <p className="text-gray-600 mb-6">
              Access the admin panel to manage summit registrations and badge issuance.
            </p>
            <Link
              href="/admin"
              className="inline-block bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Admin Panel →
            </Link>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💾 Data Storage</h2>
            <p className="text-gray-600 mb-6">
              All data is stored securely in Firebase Firestore. Access registrations and badges through the Firebase console.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">influencer-awards-engine-ia-e/registrations/*</code>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">influencer-awards-engine-ia-e/badges/*</code>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎨 Widget Integration</h2>
            <p className="text-gray-600 mb-6">
              Easily integrate both widgets into any website with just a few lines of code.
            </p>
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">/summit-register.js</code>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm">/badge-notify.js</code>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-white text-lg font-semibold mb-2">Ready for Production Deployment</h3>
            <p className="text-white/80 text-sm">
              Built with Next.js 15, TypeScript, and modern web standards. Deploy to Vercel or Netlify with zero
              configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
