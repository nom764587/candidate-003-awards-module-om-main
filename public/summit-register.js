;(() => {
  // Summit Registration Widget
  class SummitRegistrationWidget {
    constructor(options = {}) {
      this.apiBaseUrl = options.apiBaseUrl || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://influencer-awards-engine-ia-e.vercel.app')
      this.containerId = options.containerId || "summit-widget-container"
      this.influencerId = options.influencerId || "INF_" + Math.random().toString(36).substr(2, 9)
      this.theme = options.theme || "default"

      this.init()
    }

    init() {
      this.createStyles()
      this.render()
      this.attachEventListeners()
    }

    createStyles() {
      if (document.getElementById("summit-widget-styles")) return

      const styles = `
        .summit-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 400px;
          margin: 20px auto;
          text-align: center;
        }

        .summit-cta-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .summit-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .summit-cta-button:active {
          transform: translateY(0);
        }

        .summit-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 10000;
          backdrop-filter: blur(5px);
        }

        .summit-modal.show {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summit-modal-content {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 90%;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .summit-modal-close {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .summit-modal-close:hover {
          background: #f0f0f0;
          color: #333;
        }

        .summit-form {
          text-align: left;
        }

        .summit-form h2 {
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
          text-align: center;
        }

        .summit-form p {
          color: #666;
          margin-bottom: 30px;
          text-align: center;
          line-height: 1.6;
        }

        .summit-form-group {
          margin-bottom: 20px;
        }

        .summit-form label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .summit-form input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .summit-form input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .summit-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .summit-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .summit-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .summit-success {
          text-align: center;
          color: #22c55e;
          padding: 20px;
        }

        .summit-success h3 {
          margin-bottom: 10px;
          font-size: 24px;
        }

        .summit-error {
          color: #ef4444;
          margin-top: 10px;
          padding: 10px;
          background: #fef2f2;
          border-radius: 6px;
          border-left: 4px solid #ef4444;
        }

        .summit-loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `

      const styleSheet = document.createElement("style")
      styleSheet.id = "summit-widget-styles"
      styleSheet.textContent = styles
      document.head.appendChild(styleSheet)
    }

    render() {
      const container = document.getElementById(this.containerId)
      if (!container) {
        console.error("Summit Widget: Container not found")
        return
      }

      container.innerHTML = `
        <div class="summit-widget">
          <button class="summit-cta-button" id="summit-cta">
            🏆 Join the FoodStory Summit
          </button>
        </div>

        <div class="summit-modal" id="summit-modal">
          <div class="summit-modal-content">
            <button class="summit-modal-close" id="summit-modal-close">&times;</button>
            <div id="summit-form-container">
              <form class="summit-form" id="summit-form">
                <h2>🍽️ FoodStory Summit 2024</h2>
                <p>Join the most exclusive culinary influencer event of the year! Connect with top chefs, food brands, and fellow creators.</p>
                
                <div class="summit-form-group">
                  <label for="summit-email">Email Address</label>
                  <input type="email" id="summit-email" name="email" required placeholder="your@email.com">
                </div>

                <div class="summit-form-group">
                  <label for="summit-name">Full Name</label>
                  <input type="text" id="summit-name" name="name" required placeholder="Your full name">
                </div>

                <button type="submit" class="summit-submit-btn" id="summit-submit">
                  Register for Summit
                </button>

                <div id="summit-error" class="summit-error" style="display: none;"></div>
              </form>
            </div>
          </div>
        </div>
      `
    }

    attachEventListeners() {
      const ctaButton = document.getElementById("summit-cta")
      const modal = document.getElementById("summit-modal")
      const closeButton = document.getElementById("summit-modal-close")
      const form = document.getElementById("summit-form")

      ctaButton?.addEventListener("click", () => {
        modal?.classList.add("show")
      })

      closeButton?.addEventListener("click", () => {
        modal?.classList.remove("show")
      })

      modal?.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show")
        }
      })

      form?.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleSubmit()
      })
    }

    async handleSubmit() {
      const submitBtn = document.getElementById("summit-submit")
      const errorDiv = document.getElementById("summit-error")
      const emailInput = document.getElementById("summit-email")
      const nameInput = document.getElementById("summit-name")

      if (!submitBtn || !errorDiv || !emailInput || !nameInput) return

      // Clear previous errors
      errorDiv.style.display = "none"

      // Show loading state
      submitBtn.disabled = true
      submitBtn.innerHTML = '<span class="summit-loading"></span> Registering...'

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/summit/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            influencerId: this.influencerId,
            email: emailInput.value,
            name: nameInput.value,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Registration failed")
        }

        // Show success message
        this.showSuccess(data.regId)
      } catch (error) {
        errorDiv.textContent = error.message
        errorDiv.style.display = "block"
      } finally {
        submitBtn.disabled = false
        submitBtn.innerHTML = "Register for Summit"
      }
    }

    showSuccess(regId) {
      const container = document.getElementById("summit-form-container")
      if (!container) return

      container.innerHTML = `
        <div class="summit-success">
          <h3>🎉 Registration Successful!</h3>
          <p>Welcome to the FoodStory Summit!</p>
          <p><strong>Registration ID:</strong> ${regId}</p>
          <p>Check your email for event details and updates.</p>
        </div>
      `

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        const modal = document.getElementById("summit-modal")
        modal?.classList.remove("show")
      }, 3000)
    }
  }

  // Auto-initialize if container exists
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("summit-widget-container")) {
      new SummitRegistrationWidget()
    }
  })

  // Export for manual initialization
  window.SummitRegistrationWidget = SummitRegistrationWidget
})()
