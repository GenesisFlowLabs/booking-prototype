<p align="center">
  <img src="public/gw-logo.png" alt="GreenWorks Inspections" width="280" />
</p>

<h1 align="center">GreenWorks Booking Engine</h1>

<p align="center">
  <strong>A modern, mobile-first booking experience for home inspection services.</strong><br />
  Built to replace legacy iframe booking with a fast, branded, conversion-optimized flow<br />
  that writes directly to ISN (InspectionSupport.net).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/ISN-Native_API-2E7D32?style=for-the-badge" alt="ISN Native API" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker Ready" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tests-35_passing-brightgreen?style=flat-square" alt="35 tests passing" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build passing" />
  <img src="https://img.shields.io/badge/license-private-lightgrey?style=flat-square" alt="Private" />
</p>

---

## What This Does

Customers land on a single page. Five steps. They pick a service, enter their address, choose a package, pick a time slot, and confirm. The order lands in ISN instantly -- no iframe, no redirect, no friction.

```
Service Type  -->  Property Details  -->  Package  -->  Schedule  -->  Confirm
    (1)                 (2)               (3)           (4)           (5)
```

Every step animates with Framer Motion. The flow persists in `localStorage` so customers can leave and come back. Sessions auto-expire after 2 hours.

---

## Features

### Booking Flow
| Feature | Description |
|---------|-------------|
| **5-Step Guided Flow** | Service type > details > package > schedule > confirm |
| **ISN Native Integration** | Orders POST directly to ISN API -- no iframes |
| **Real-Time Availability** | Pulls live inspector time slots from ISN |
| **Google Places Autocomplete** | Address input with autocomplete and zip validation |
| **Session Persistence** | Zustand + localStorage -- users can leave and return |
| **Auto-Scroll Guidance** | Steps auto-scroll to the next action after selection |
| **Animated Transitions** | Framer Motion slide transitions between steps |
| **Mobile-First** | Responsive from 320px up with touch-optimized inputs |

### Packages

<table>
<tr>
<th colspan="3" align="center">Pre-Owned Home Inspections</th>
</tr>
<tr>
<td align="center"><strong>Green</strong><br/><code>$545+</code><br/><sub>14 services included</sub></td>
<td align="center"><strong>Greener</strong> &#11088;<br/><code>$895+</code><br/><sub>+ Sewer, Pool/Septic, Air Quality</sub></td>
<td align="center"><strong>Greenest</strong><br/><code>$1,295+</code><br/><sub>+ 3D Floor Plan, Sq Ft, Engineer Report</sub></td>
</tr>
</table>

<table>
<tr>
<th colspan="3" align="center">New Construction</th>
</tr>
<tr>
<td align="center"><strong>NC1</strong><br/><code>$725</code><br/><sub>Final + warranty + essentials</sub></td>
<td align="center"><strong>NC2</strong> &#11088;<br/><code>$1,050</code><br/><sub>+ Pre-drywall + sewer</sub></td>
<td align="center"><strong>NC3</strong><br/><code>$1,695</code><br/><sub>+ Repair verification + blue tape</sub></td>
</tr>
</table>

Plus: **Engineering**, **Environmental**, and **Commercial** service types.

### VIP Agent Links

Each sales rep gets a unique booking URL:

```
?vip=jordan   -->  Jordan Vanover
?vip=gaby     -->  Gaby Vasquez
?vip=jake     -->  Jake Johnson
?vip=hannah   -->  Hannah Carter
```

When a customer books through a VIP link:
- The agent's name appears in a branded banner
- The order is attributed to that agent in ISN
- The team gets notified via the internal webhook

### ISN Integration

| Endpoint | Purpose |
|----------|---------|
| `POST /api/isn/order` | Create order in ISN |
| `GET /api/isn/availability` | Fetch inspector time slots |
| `GET /api/isn/packages` | Resolve ISN service bundles |
| `GET /api/isn/services` | List available services |
| `GET /api/isn/agents` | Look up real estate agents |
| `POST /api/isn/webhook` | Receive ISN event callbacks |
| `GET /api/isn/hooks` | Manage webhook registrations |
| `POST /api/isn/notify` | Internal team notification relay |

### UX Details

- **Pulsing continue buttons** when a step is ready to advance
- **Foundation type selector** (Slab / Pier & Beam / Not Sure)
- **Phone +1 handling** for autofill country code prefix
- **Celebratory success screen** with confetti burst, personalized greeting, appointment card
- **Referring agent lookup** with ISN agent search + new agent capture
- **Branded OG image** for social sharing (1200x630)

---

## Architecture

```
src/
├── app/
│   ├── api/isn/          # ISN API proxy routes (server-side)
│   ├── api/agents/       # Agent lookup
│   ├── api/property/     # Property data
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Single-page booking app
│   └── opengraph-image.tsx
├── components/
│   ├── booking/          # Step components (the core flow)
│   ├── layout/           # Header
│   ├── social/           # Trust badges, stats strip
│   └── ui/               # Button, Input, RadioCard, AnimatedCounter
├── data/                 # Static config: packages, services, agents, VIPs
├── hooks/                # useGooglePlaces
├── lib/                  # ISN client, mappings, cache, email, webhook auth
├── store/                # Zustand booking state (persisted)
└── types/                # TypeScript interfaces
```

**Key design decisions:**
- **Single-page app** -- no routing, no page loads, just animated steps
- **Server-side ISN calls** -- credentials never touch the browser
- **Zustand store** -- persisted to localStorage with 2-hour TTL
- **ISN mappings** -- package tiers mapped to ISN order type UUIDs

---

## Quick Start

```bash
# Clone
git clone git@github.com:GenesisFlowLabs/booking-prototype.git
cd booking-prototype

# Install
npm install

# Configure
cp .env.example .env.local
# Fill in your ISN and Google Maps credentials

# Dev
npm run dev

# Test
npm test

# Build
npm run build
```

### Environment Variables

```env
# Required -- ISN API
ISN_ACCESS_KEY=           # Your ISN access key
ISN_SECRET_KEY=           # Your ISN secret
ISN_COMPANY_KEY=          # Your ISN company slug
ISN_BASE_URL=             # ISN API base URL

# Required -- Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=   # Places Autocomplete API key

# Optional
MELISSA_API_KEY=          # Address verification
RESEND_API_KEY=           # Transactional email
INTERNAL_API_SECRET=      # Webhook authentication
```

---

## Docker

Production-ready multi-stage build:

```bash
docker build -t greenworks-booking .
docker run -p 3000:3000 --env-file .env.local greenworks-booking
```

The Dockerfile uses Node 22 Alpine with a standalone Next.js output for minimal image size.

---

## Tests

```bash
npm test              # Run once
npm run test:watch    # Watch mode
```

```
 Test Files  4 passed (4)
      Tests  35 passed (35)
```

Coverage: ISN order type mapping, order note generation, address formatting, webhook authentication, response caching.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19 + Tailwind CSS 4 |
| **State** | Zustand with localStorage persistence |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Testing** | Vitest |
| **Deployment** | Docker (multi-stage) + Traefik |
| **API** | ISN (InspectionSupport.net) |
| **Address** | Google Places Autocomplete |
| **Language** | TypeScript 5 (strict) |

---

## Credits

Built by **Jordan Vanover** and [Genesis Flow Labs](https://genesisflowlabs.com).

Jordan designed the booking flow, conversation architecture, and GreenWorks growth strategy. Genesis Flow Labs handled the engineering, ISN integration, and production deployment.

---

<p align="center">
  <sub>GreenWorks Inspections &bull; DFW, Texas</sub>
</p>
