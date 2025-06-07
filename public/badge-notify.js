;(() => {
  // Badge Notification Widget
  class BadgeNotificationWidget {
    constructor(options = {}) {
      this.apiBaseUrl = options.apiBaseUrl || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://influencer-awards-engine-ia-e.vercel.app')
      this.influencerId = options.influencerId || "INF_" + Math.random().toString(36).substr(2, 9)
      this.containerId = options.containerId || "badge-notification-container"
      this.checkInterval = options.checkInterval || 30000 // 30 seconds
      this.lastChecked = new Date().toISOString()
      this.knownBadges = new Set()
      
      this.init()
    }

    init() {
      this.createStyles()
      this.render()
      this.loadExistingBadges()
      this.startPolling()
    }

    createStyles() {
      if (document.getElementById("badge-notification-styles")) return

      const styles = `
        .badge-notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .badge-notification {
          background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
          color: #333;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
          margin-bottom: 10px;
          min-width: 300px;
          max-width: 400px;
          position: relative;
          animation: slideInRight 0.5s ease-out;
          border: 2px solid #ffd700;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .badge-notification.removing {
          animation: slideOutRight 0.3s ease-in;
        }

        .badge-notification-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .badge-notification-icon {
          font-size: 24px;
          margin-right: 12px;
        }

        .badge-notification-title {
          font-weight: 700;
          font-size: 16px;
          margin: 0;
        }

        .badge-notification-close {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #666;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .badge-notification-close:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #333;
        }

        .badge-notification-message {
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          padding-right: 20px;
        }

        .badge-notification-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.3);
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 8px;
        }

        .badge-list-container {
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 9999;
        }

        .badge-list-toggle {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }

        .badge-list-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .badge-list {
          display: none;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-top: 10px;
          max-width: 350px;
          max-height: 400px;
          overflow-y: auto;
        }

        .badge-list.show {
          display: block;
          animation: fadeInUp 0.3s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .badge-list h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
        }

        .badge-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 8px;
          background: #f8f9fa;
          border-left: 4px solid #ffd700;
        }

        .badge-item-icon {
          font-size: 20px;
          margin-right: 12px;
        }

        .badge-item-content {
          flex: 1;
        }

        .badge-item-name {
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .badge-item-date {
          font-size: 12px;
          color: #666;
          margin: 0;
        }

        .badge-list-empty {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 20px;
        }
      `

      const styleSheet = document.createElement("style")
      styleSheet.id = "badge-notification-styles"
      styleSheet.textContent = styles
      document.head.appendChild(styleSheet)
    }

    render() {
      // Create notification container
      let container = document.getElementById(this.containerId)
      if (!container) {
        container = document.createElement("div")
        container.id = this.containerId
        container.className = "badge-notification-container"
        document.body.appendChild(container)
      }

      // Create badge list container
      let listContainer = document.getElementById("badge-list-container")
      if (!listContainer) {
        listContainer = document.createElement("div")
        listContainer.id = "badge-list-container"
        listContainer.className = "badge-list-container"
        listContainer.innerHTML = `
          <button class="badge-list-toggle" id="badge-list-toggle">
            🏆 My Badges
          </button>
          <div class="badge-list" id="badge-list">
            <h3>🏆 Your Badges</h3>
            <div id="badge-list-content">
              <div class="badge-list-empty">Loading badges...</div>
            </div>
          </div>
        `
        document.body.appendChild(listContainer)

        // Add toggle functionality
        const toggleBtn = document.getElementById("badge-list-toggle")
        const badgeList = document.getElementById("badge-list")
        
        toggleBtn?.addEventListener("click", () => {
          badgeList?.classList.toggle("show")
        })

        // Close when clicking outside
        document.addEventListener("click", (e) => {
          if (!listContainer.contains(e.target)) {
            badgeList?.classList.remove("show")
          }
        })
      }
    }

    async loadExistingBadges() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/badges?influencerId=${this.influencerId}`)
        if (response.ok) {
          const badges = await response.json()
          badges.forEach(badge => {
            this.knownBadges.add(badge.badgeId)
          })
          this.updateBadgeList(badges)
        }
      } catch (error) {
        console.error("Error loading existing badges:", error)
      }
    }

    async checkForNewBadges() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/badges?influencerId=${this.influencerId}`)
        if (response.ok) {
          const badges = await response.json()
          const newBadges = badges.filter(badge => 
            !this.knownBadges.has(badge.badgeId) && 
            new Date(badge.awardedAt) > new Date(this.lastChecked)
          )

          newBadges.forEach(badge => {
            this.showNotification(badge)
            this.knownBadges.add(badge.badgeId)
          })

          this.updateBadgeList(badges)
          this.lastChecked = new Date().toISOString()
        }
      } catch (error) {
        console.error("Error checking for new badges:", error)
      }
    }

    showNotification(badge) {
      const container = document.getElementById(this.containerId)
      if (!container) return

      const notification = document.createElement("div")
      notification.className = "badge-notification"
      notification.innerHTML = `
        <button class="badge-notification-close">&times;</button>
        <div class="badge-notification-header">
          <span class="badge-notification-icon">🏆</span>
          <h4 class="badge-notification-title">New Badge Earned!</h4>
        </div>
        <p class="badge-notification-message">
          Congratulations! You've earned a new badge.
          <span class="badge-notification-badge">${badge.badge}</span>
        </p>
      `

      // Add close functionality
      const closeBtn = notification.querySelector(".badge-notification-close")
      closeBtn?.addEventListener("click", () => {
        this.removeNotification(notification)
      })

      // Auto-remove after 5 seconds
      setTimeout(() => {
        this.removeNotification(notification)
      }, 5000)

      container.appendChild(notification)

      // Play notification sound (if supported)
      this.playNotificationSound()
    }

    removeNotification(notification) {
      if (notification && notification.parentNode) {
        notification.classList.add("removing")
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 300)
      }
    }

    updateBadgeList(badges) {
      const content = document.getElementById("badge-list-content")
      if (!content) return

      if (badges.length === 0) {
        content.innerHTML = '<div class="badge-list-empty">No badges earned yet</div>'
        return
      }

      // Sort badges by date (newest first)
      const sortedBadges = badges.sort((a, b) => new Date(b.awardedAt) - new Date(a.awardedAt))

      content.innerHTML = sortedBadges.map(badge => `
        <div class="badge-item">
          <span class="badge-item-icon">🏆</span>
          <div class="badge-item-content">
            <div class="badge-item-name">${badge.badge}</div>
            <div class="badge-item-date">${new Date(badge.awardedAt).toLocaleDateString()}</div>
          </div>
        </div>
      `).join('')

      // Update toggle button with count
      const toggleBtn = document.getElementById("badge-list-toggle")
      if (toggleBtn) {
        toggleBtn.textContent = `🏆 My Badges (${badges.length})`
      }
    }

    playNotificationSound() {
      try {
        // Create a simple notification sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
      } catch (error) {
        // Fallback: no sound if Web Audio API is not supported
        console.log("Notification sound not supported")
      }
    }

    startPolling() {
      // Check for new badges immediately
      this.checkForNewBadges()
      
      // Then check periodically
      setInterval(() => {
        this.checkForNewBadges()
      }, this.checkInterval)
    }

    // Public method to manually trigger badge check
    checkNow() {
      this.checkForNewBadges()
    }

    // Public method to show a test notification
    showTestNotification() {
      this.showNotification({
        badgeId: "TEST_001",
        badge: "Test Badge",
        awardedAt: new Date().toISOString()
      })
    }
  }

  // Auto-initialize if influencer ID is provided via data attribute
  document.addEventListener("DOMContentLoaded", () => {
    const script = document.querySelector('script[data-influencer-id]')
    if (script) {
      const influencerId = script.getAttribute('data-influencer-id')
      window.BadgeNotificationWidgetObject =new BadgeNotificationWidget({ influencerId })
    }
  })

  // Export for manual initialization
  window.BadgeNotificationWidget = BadgeNotificationWidget
})()