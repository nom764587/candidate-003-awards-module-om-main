# 🏆 Influencer Awards Engine

A plug-and-play backend + JS library for running quarterly awards, monthly micro-contests, leaderboards, and badge issuance. Simply drop in the scripts or hit the APIs to get started.

## 🚀 Quick Links

- [Landing Page](https://influencer-awards-engine-ia-e.vercel.app)
- [Summit Registration Demo](https://influencer-awards-engine-ia-e.vercel.app/summit-demo.html)
- [Badge System Demo](https://influencer-awards-engine-ia-e.vercel.app/badge-demo.html)
- [Admin Panel](https://influencer-awards-engine-ia-e.vercel.app/admin)

## 📥 Installation

1. Clone the repository:
```bash
git clone https://github.com/iamthehimansh/candidate-003-awards-module-himansh.git
cd candidate-003-awards-module-himansh
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Firestore Database
   - Generate a service account key from Project Settings > Service Accounts
   - Create a `.env.local` file and add your Firebase configuration as a stringified JSON:
```bash
# Important: The entire service account JSON must be stringified
# Example of correct format:
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id"...}'

# Actual configuration (replace with your values):
FIREBASE_SERVICE_ACCOUNT='{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-client-cert-url"
}'
```
Note: Make sure to stringify the JSON and escape any special characters in the private key.

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 Features

### Summit Registration Widget

- Beautiful, responsive registration form
- Real-time validation and error handling
- Customizable themes and styling
- Secure API integration
- Admin dashboard for registration management

### Badge Issuance & Notification System

- Real-time badge notifications
- Audio alerts with Web Audio API
- Badge management interface
- Mobile-responsive design
- Secure badge issuance API

## 🔌 Integration Guide

### 1. Summit Registration Widget

```html
<!-- Add the widget script -->
<script src="https://influencer-awards-engine-ia-e.vercel.app/summit-register.js"></script>

<!-- Add the container -->
<div id="summit-widget-container"></div>

<!-- Initialize with custom options (optional) -->
<script>
new SummitRegistrationWidget({
    influencerId: 'INF_123',
    apiBaseUrl: 'https://influencer-awards-engine-ia-e.vercel.app',
    theme: 'custom'
});
</script>
```

### 2. Badge Notification System

```html
<!-- Method 1: Auto-initialization with data attribute -->
<script 
  src="https://influencer-awards-engine-ia-e.vercel.app/badge-notify.js" 
  data-influencer-id="INF_123">
</script>

<!-- Method 2: Manual initialization with options -->
<script src="https://influencer-awards-engine-ia-e.vercel.app/badge-notify.js"></script>
<script>
new BadgeNotificationWidget({
    influencerId: 'INF_123',
    apiBaseUrl: 'https://influencer-awards-engine-ia-e.vercel.app',
    checkInterval: 30000 // Check every 30 seconds
});
</script>
```

## 🔧 API Reference

### Summit Registration

```http
POST /api/summit/register
Content-Type: application/json

{
  "influencerId": "INF_123",
  "email": "chef@example.com",
  "name": "Chef Gordon"
}

Response: { "regId": "SR_001" }
```

### Badge System

```http
# Issue Badge
POST /api/badges/issue
Content-Type: application/json

{
  "influencerId": "INF_123",
  "badge": "TopChef"
}

Response: { "badgeId": "BD_001" }

# Fetch Badges
GET /api/badges?influencerId=INF_123

Response: [
  {
    "badgeId": "BD_001",
    "influencerId": "INF_123",
    "badge": "TopChef",
    "awardedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## 🛠️ Technical Specifications

### Frontend
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Vanilla JavaScript widgets (no dependencies)
- Web Audio API for notifications
- Responsive design with mobile-first approach

### Backend
- Next.js API Routes
- Firebase Firestore for data storage
- Real-time data synchronization
- RESTful API architecture
- Input validation and error handling

### Security
- API key authentication for admin access
- Input sanitization and validation
- CORS protection
- Rate limiting
- Error handling and logging

### Performance
- Optimized bundle size
- Lazy loading of components
- Efficient real-time updates
- Caching strategies
- CDN deployment

## 🎨 Widget Customization

Both widgets support extensive customization through options:

```javascript
// Summit Registration Widget Options
{
  containerId: 'custom-container',
  influencerId: 'INF_123',
  apiBaseUrl: 'https://your-api.com',
  theme: 'custom'
}

// Badge Notification Widget Options
{
  containerId: 'badge-container',
  influencerId: 'INF_123',
  apiBaseUrl: 'https://your-api.com',
  checkInterval: 30000,
  theme: 'custom'
}
```

## 📱 Mobile Responsiveness

Both widgets are fully responsive and tested across:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS, Android)
- Tablets and iPads
- Different screen sizes and orientations

## 🔒 Admin Panel

Access the admin panel at `/admin` to:
- View and manage summit registrations
- Monitor badge issuance
- View analytics and statistics
- Manage influencer data

Demo credentials:
```
API Key: admin-secret-key
```

## 🚀 Deployment

1. Create a Vercel account if you haven't already
2. Install Vercel CLI:
```bash
npm i -g vercel
```

3. Deploy to Vercel:
```bash
vercel
```

4. Add environment variables in Vercel:
   - Go to your project settings
   - Add `FIREBASE_SERVICE_ACCOUNT` with your stringified Firebase service account JSON
   - Redeploy if needed

The demo is deployed at:
[https://influencer-awards-engine-ia-e.vercel.app](https://influencer-awards-engine-ia-e.vercel.app)

## 📦 Project Structure

```
├── app/
│   ├── admin/         # Admin panel
│   ├── api/          # API routes
│   └── page.tsx      # Landing page
├── public/
│   ├── badge-notify.js    # Badge widget
│   ├── summit-register.js  # Summit widget
│   ├── badge-demo.html     # Badge demo page
│   └── summit-demo.html    # Summit demo page
└── components/      # UI components
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.