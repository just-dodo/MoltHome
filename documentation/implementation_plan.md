# Implementation Plan

## MoltHome - OpenClaw Gateway Deployment Platform

**Version:** 1.0
**Date:** 2026-02-05

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Phase 1: Foundation (Week 1-2)](#3-phase-1-foundation-week-1-2)
4. [Phase 2: Core Features (Week 3-4)](#4-phase-2-core-features-week-3-4)
5. [Phase 3: Instance Management (Week 5-6)](#5-phase-3-instance-management-week-5-6)
6. [Phase 4: Billing & Polish (Week 7-8)](#6-phase-4-billing--polish-week-7-8)
7. [API Specifications](#7-api-specifications)
8. [Database Migrations](#8-database-migrations)
9. [Environment Variables](#9-environment-variables)
10. [Deployment](#10-deployment)

---

## 1. Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI component library |
| **React Query** | Server state management |
| **Zustand** | Client state management |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | API endpoints |
| **Supabase** | Auth, Database, Realtime |
| **Supabase PostgreSQL** | Primary database |
| **GCP Secret Manager** | Secrets storage |
| **GCP Cloud Tasks** | Job queue for deployments |
| **GCP Compute Engine** | VM instances for OpenClaw |

### External Services
| Service | Purpose |
|---------|---------|
| **Supabase Auth** | Google OAuth authentication |
| **Paddle** | Subscription billing |
| **Resend** | Transactional emails |
| **Vercel** | Hosting & deployment |

### Development Tools
| Tool | Purpose |
|------|---------|
| **pnpm** | Package manager |
| **ESLint** | Linting |
| **Prettier** | Code formatting |
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |

---

## 2. Project Structure

```
molthome/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (no layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts      # OAuth callback
│   │
│   ├── (marketing)/              # Public pages
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   └── pricing/
│   │       └── page.tsx
│   │
│   ├── (onboarding)/             # Onboarding flow
│   │   ├── layout.tsx
│   │   ├── plan/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── instance/
│   │   │   └── page.tsx
│   │   ├── deploying/
│   │   │   └── page.tsx
│   │   └── success/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/              # Authenticated app
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Instance list
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Create instance wizard
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Instance detail
│   │   │       ├── logs/
│   │   │       │   └── page.tsx
│   │   │       ├── channels/
│   │   │       │   └── page.tsx
│   │   │       ├── pairing/
│   │   │       │   └── page.tsx
│   │   │       └── settings/
│   │   │           └── page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── api-keys/
│   │   │       └── page.tsx
│   │   └── billing/
│   │       ├── page.tsx
│   │       ├── plans/
│   │       │   └── page.tsx
│   │       └── invoices/
│   │           └── page.tsx
│   │
│   ├── api/                      # API routes
│   │   ├── instances/
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts      # GET, PATCH, DELETE
│   │   │       ├── start/
│   │   │       │   └── route.ts
│   │   │       ├── stop/
│   │   │       │   └── route.ts
│   │   │       ├── restart/
│   │   │       │   └── route.ts
│   │   │       ├── logs/
│   │   │       │   └── route.ts
│   │   │       ├── channels/
│   │   │       │   └── route.ts
│   │   │       └── pairing/
│   │   │           └── route.ts
│   │   ├── secrets/
│   │   │   └── route.ts
│   │   ├── webhooks/
│   │   │   ├── paddle/
│   │   │   │   └── route.ts
│   │   │   └── gcp/
│   │   │       └── route.ts
│   │   └── health/
│   │       └── route.ts
│   │
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── auth/
│   │   └── google-button.tsx
│   ├── instances/
│   │   ├── instance-card.tsx
│   │   ├── instance-wizard.tsx
│   │   ├── instance-status.tsx
│   │   └── deployment-progress.tsx
│   ├── channels/
│   │   ├── channel-list.tsx
│   │   └── add-channel-modal.tsx
│   ├── pairing/
│   │   ├── pending-list.tsx
│   │   └── paired-devices.tsx
│   └── billing/
│       ├── plan-card.tsx
│       ├── usage-bar.tsx
│       └── invoice-list.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── middleware.ts         # Auth middleware
│   │   └── types.ts              # Database types
│   ├── gcp/
│   │   ├── compute.ts            # Compute Engine API
│   │   ├── secrets.ts            # Secret Manager
│   │   └── tasks.ts              # Cloud Tasks
│   ├── paddle/
│   │   ├── client.ts
│   │   └── webhooks.ts
│   ├── openclaw/
│   │   ├── deploy.ts             # Deployment functions
│   │   ├── config.ts             # Config generation
│   │   └── ssh.ts                # SSH commands
│   └── utils/
│       ├── crypto.ts             # Encryption helpers
│       └── validation.ts         # Zod schemas
│
├── hooks/
│   ├── use-instances.ts
│   ├── use-instance.ts
│   ├── use-channels.ts
│   ├── use-pairing.ts
│   └── use-subscription.ts
│
├── stores/
│   ├── wizard-store.ts           # Instance creation wizard state
│   └── ui-store.ts               # UI state (modals, etc.)
│
├── types/
│   ├── instance.ts
│   ├── channel.ts
│   ├── subscription.ts
│   └── api.ts
│
├── scripts/
│   └── deploy-openclaw.py        # Python deployment script
│
├── supabase/
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Seed data
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── .env.local                    # Local environment
├── .env.example                  # Example env file
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. Phase 1: Foundation (Week 1-2)

### Week 1: Project Setup & Auth

#### Day 1-2: Project Initialization
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up ESLint and Prettier
- [ ] Create project structure (folders)
- [ ] Set up Git repository

```bash
# Commands
pnpm create next-app@latest molthome --typescript --tailwind --app --src-dir=false
cd molthome
pnpm add @supabase/supabase-js @supabase/ssr
pnpm dlx shadcn-ui@latest init
```

#### Day 3-4: Supabase Setup
- [ ] Create Supabase project
- [ ] Configure Google OAuth provider
- [ ] Create database tables (initial migration)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create Supabase client utilities
- [ ] Test auth flow locally

**Database Tables (Initial):**
```sql
-- Create molthome schema
CREATE SCHEMA IF NOT EXISTS molthome;

-- users table (extends auth.users)
CREATE TABLE molthome.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  google_id TEXT UNIQUE,
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'pro')),
  paddle_customer_id TEXT,
  paddle_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('active', 'paused', 'cancelled', 'none')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE molthome.users ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own row
CREATE POLICY "Users can view own profile" ON molthome.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON molthome.users
  FOR UPDATE USING (auth.uid() = id);
```

#### Day 5: Auth Implementation
- [ ] Create login page with Google OAuth button
- [ ] Implement OAuth callback handler
- [ ] Create auth middleware for protected routes
- [ ] Implement logout functionality
- [ ] Add user profile creation on first login

**Files to create:**
- `app/(auth)/login/page.tsx`
- `app/auth/callback/route.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`

### Week 2: Layout & Basic Pages

#### Day 6-7: Layout Components
- [ ] Create marketing layout (header, footer)
- [ ] Create dashboard layout (sidebar, header)
- [ ] Create onboarding layout
- [ ] Implement responsive navigation
- [ ] Add user dropdown menu

**Components:**
- `components/layout/marketing-header.tsx`
- `components/layout/marketing-footer.tsx`
- `components/layout/dashboard-layout.tsx`
- `components/layout/dashboard-sidebar.tsx`
- `components/layout/user-menu.tsx`

#### Day 8-9: Marketing Pages
- [ ] Build landing page
- [ ] Build pricing page
- [ ] Add hero section with CTA
- [ ] Add features section
- [ ] Add pricing cards

**Pages:**
- `app/(marketing)/page.tsx` - Landing
- `app/(marketing)/pricing/page.tsx` - Pricing

#### Day 10: Dashboard Shell
- [ ] Create empty dashboard page
- [ ] Create settings page shell
- [ ] Create billing page shell
- [ ] Add route protection (redirect if not authenticated)
- [ ] Add subscription check (redirect to onboarding if no subscription)

---

## 4. Phase 2: Core Features (Week 3-4)

### Week 3: Paddle Integration & Onboarding

#### Day 11-12: Paddle Setup
- [ ] Create Paddle account and get API keys
- [ ] Create products and prices in Paddle
- [ ] Implement Paddle.js checkout
- [ ] Create webhook endpoint for Paddle events
- [ ] Handle subscription events (created, updated, cancelled)

**Paddle Products:**
| Product | Price ID | Amount |
|---------|----------|--------|
| Starter Monthly | pri_starter_monthly | $30/month |
| Pro Monthly | pri_pro_monthly | $100/month |

**Webhook Events to Handle:**
- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`
- `subscription.paused`
- `transaction.completed`

**Files:**
- `lib/paddle/client.ts`
- `lib/paddle/webhooks.ts`
- `app/api/webhooks/paddle/route.ts`

#### Day 13-14: Onboarding Flow - Plan Selection
- [ ] Create plan selection page
- [ ] Display plan comparison cards
- [ ] Integrate Paddle checkout overlay
- [ ] Handle successful payment redirect
- [ ] Update user subscription status

**Pages:**
- `app/(onboarding)/plan/page.tsx`
- `app/(onboarding)/checkout/page.tsx`

#### Day 15: Onboarding Flow - Instance Creation
- [ ] Create onboarding instance wizard
- [ ] Reuse instance creation components
- [ ] Store wizard state in Zustand
- [ ] Redirect to deploying page on submit

**Pages:**
- `app/(onboarding)/instance/page.tsx`
- `stores/wizard-store.ts`

### Week 4: GCP Integration

#### Day 16-17: GCP Setup
- [ ] Create GCP service account for MoltHome
- [ ] Set up IAM permissions
- [ ] Configure Secret Manager
- [ ] Set up Cloud Tasks queue
- [ ] Test GCP API access

**IAM Roles Needed:**
- `roles/compute.instanceAdmin.v1` - Create/manage VMs
- `roles/secretmanager.secretAccessor` - Read secrets
- `roles/cloudtasks.enqueuer` - Enqueue tasks

**Files:**
- `lib/gcp/compute.ts`
- `lib/gcp/secrets.ts`
- `lib/gcp/tasks.ts`

#### Day 18-19: Deployment Worker
- [ ] Port Python deployment script to TypeScript (or keep Python)
- [ ] Create Cloud Tasks handler for deployments
- [ ] Implement deployment status updates
- [ ] Store deployment logs

**Deployment Steps (in order):**
1. Create VM instance
2. Wait for SSH ready
3. Install Docker
4. Clone OpenClaw repo
5. Create config files
6. Build Docker image
7. Start container
8. Verify health

**Files:**
- `lib/openclaw/deploy.ts`
- `app/api/tasks/deploy/route.ts`

#### Day 20: Deployment Progress UI
- [ ] Create deployment progress page
- [ ] Poll for deployment status
- [ ] Show step-by-step progress
- [ ] Handle deployment errors
- [ ] Redirect to success on completion

**Pages:**
- `app/(onboarding)/deploying/page.tsx`
- `app/(onboarding)/success/page.tsx`

---

## 5. Phase 3: Instance Management (Week 5-6)

### Week 5: Instance CRUD

#### Day 21-22: Instance API
- [ ] Create instances table migration
- [ ] Implement list instances API
- [ ] Implement create instance API
- [ ] Implement get instance API
- [ ] Implement delete instance API
- [ ] Add RLS policies

**Database:**
```sql
CREATE TABLE molthome.instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES molthome.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gcp_instance_name TEXT UNIQUE NOT NULL,
  zone TEXT NOT NULL DEFAULT 'us-central1-a',
  machine_type TEXT NOT NULL DEFAULT 'e2-small',
  status TEXT DEFAULT 'provisioning' CHECK (status IN ('provisioning', 'running', 'stopped', 'error', 'deleted')),
  external_ip TEXT,
  gateway_token TEXT NOT NULL,
  deployment_log JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_instances_user_id ON molthome.instances(user_id);
CREATE INDEX idx_instances_status ON molthome.instances(status);

-- RLS
ALTER TABLE molthome.instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own instances" ON molthome.instances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create instances" ON molthome.instances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own instances" ON molthome.instances
  FOR UPDATE USING (auth.uid() = user_id);
```

**API Routes:**
- `GET /api/instances` - List user's instances
- `POST /api/instances` - Create new instance
- `GET /api/instances/[id]` - Get instance details
- `DELETE /api/instances/[id]` - Delete instance

#### Day 23-24: Instance Actions
- [ ] Implement start instance API
- [ ] Implement stop instance API
- [ ] Implement restart instance API
- [ ] Implement logs API (fetch from VM)
- [ ] Create React Query hooks

**API Routes:**
- `POST /api/instances/[id]/start`
- `POST /api/instances/[id]/stop`
- `POST /api/instances/[id]/restart`
- `GET /api/instances/[id]/logs`

**Hooks:**
- `hooks/use-instances.ts`
- `hooks/use-instance.ts`

#### Day 25: Dashboard UI
- [ ] Create instance card component
- [ ] Create instance list page
- [ ] Add quick actions (start/stop)
- [ ] Add status indicators
- [ ] Add loading states

**Components:**
- `components/instances/instance-card.tsx`
- `components/instances/instance-status.tsx`
- `components/instances/instance-actions.tsx`

### Week 6: Instance Details & Channels

#### Day 26-27: Instance Detail Page
- [ ] Create instance detail layout with tabs
- [ ] Implement overview tab
- [ ] Show gateway token (masked)
- [ ] Show statistics (placeholder)
- [ ] Add quick actions

**Pages:**
- `app/(dashboard)/dashboard/[id]/page.tsx`

**Components:**
- `components/instances/instance-detail.tsx`
- `components/instances/gateway-token.tsx`
- `components/instances/instance-stats.tsx`

#### Day 28-29: Channel Management
- [ ] Create channels table
- [ ] Implement add channel API
- [ ] Implement remove channel API
- [ ] Create channel list UI
- [ ] Create add channel modal

**Database:**
```sql
CREATE TABLE molthome.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID REFERENCES molthome.instances(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('telegram', 'discord')),
  config JSONB NOT NULL, -- encrypted bot token, etc.
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS via instance ownership
ALTER TABLE molthome.channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage channels via instance" ON molthome.channels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM molthome.instances
      WHERE instances.id = channels.instance_id
      AND instances.user_id = auth.uid()
    )
  );
```

#### Day 30: Pairing Management
- [ ] Implement pairing API (list pending, approve, reject)
- [ ] Create pairing list UI
- [ ] Create approve/reject modals
- [ ] Show paired devices list

**API Routes:**
- `GET /api/instances/[id]/pairing` - List pending & paired
- `POST /api/instances/[id]/pairing/approve` - Approve pairing
- `POST /api/instances/[id]/pairing/reject` - Reject pairing
- `DELETE /api/instances/[id]/pairing/[deviceId]` - Revoke device

---

## 6. Phase 4: Billing & Polish (Week 7-8)

### Week 7: Billing & Settings

#### Day 31-32: Billing Dashboard
- [ ] Create billing overview page
- [ ] Show current plan and status
- [ ] Show usage metrics
- [ ] Add change plan button
- [ ] Add cancel subscription button

**Pages:**
- `app/(dashboard)/billing/page.tsx`
- `app/(dashboard)/billing/plans/page.tsx`

**Components:**
- `components/billing/current-plan.tsx`
- `components/billing/usage-display.tsx`
- `components/billing/plan-selector.tsx`

#### Day 33: Invoice History
- [ ] Fetch invoices from Paddle
- [ ] Create invoice list page
- [ ] Add PDF download links

**Pages:**
- `app/(dashboard)/billing/invoices/page.tsx`

#### Day 34-35: User Settings
- [ ] Create profile settings page
- [ ] Implement name update
- [ ] Create API keys management page
- [ ] Implement save/delete API keys (encrypted)

**Pages:**
- `app/(dashboard)/settings/page.tsx`
- `app/(dashboard)/settings/profile/page.tsx`
- `app/(dashboard)/settings/api-keys/page.tsx`

**Database:**
```sql
CREATE TABLE molthome.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES molthome.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('anthropic')),
  encrypted_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE molthome.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own API keys" ON molthome.api_keys
  FOR ALL USING (auth.uid() = user_id);
```

### Week 8: Polish & Launch

#### Day 36-37: Error Handling & Loading States
- [ ] Add error boundaries
- [ ] Create error pages (404, 500)
- [ ] Add loading skeletons throughout
- [ ] Implement toast notifications
- [ ] Add confirmation modals

#### Day 38: Testing
- [ ] Write unit tests for critical functions
- [ ] Write E2E tests for main flows
- [ ] Test payment flow with Paddle sandbox
- [ ] Test deployment flow

**Test Scenarios:**
- User signup → plan selection → checkout → instance creation
- Instance start/stop/restart
- Channel addition/removal
- Pairing approval/rejection
- Subscription upgrade/downgrade/cancel

#### Day 39: Security Audit
- [ ] Review RLS policies
- [ ] Check API authentication
- [ ] Verify secret encryption
- [ ] Test rate limiting
- [ ] Review CORS settings

#### Day 40: Deployment & Launch
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Configure Paddle production webhooks
- [ ] Deploy to production
- [ ] Smoke test all features

---

## 7. API Specifications

### Authentication
All API routes require authentication via Supabase session cookie.

### Response Format
```typescript
// Success
{
  "data": { ... },
  "error": null
}

// Error
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Endpoints

#### Instances

**GET /api/instances**
```typescript
// Response
{
  "data": [
    {
      "id": "uuid",
      "name": "My Bot",
      "status": "running",
      "external_ip": "34.123.45.67",
      "channels": [
        { "type": "telegram", "status": "active" }
      ],
      "created_at": "2026-02-05T10:00:00Z"
    }
  ]
}
```

**POST /api/instances**
```typescript
// Request
{
  "name": "My Bot",
  "zone": "us-central1-a",
  "anthropic_key": "sk-ant-...",
  "channels": [
    { "type": "telegram", "token": "123:ABC" }
  ]
}

// Response
{
  "data": {
    "id": "uuid",
    "name": "My Bot",
    "status": "provisioning"
  }
}
```

**POST /api/instances/[id]/start**
```typescript
// Response
{
  "data": {
    "id": "uuid",
    "status": "running"
  }
}
```

#### Pairing

**GET /api/instances/[id]/pairing**
```typescript
// Response
{
  "data": {
    "pending": [
      {
        "request_id": "uuid",
        "device_id": "hash",
        "platform": "MacIntel",
        "created_at": "2026-02-05T10:00:00Z"
      }
    ],
    "paired": [
      {
        "device_id": "hash",
        "platform": "MacIntel",
        "paired_at": "2026-02-05T09:00:00Z"
      }
    ]
  }
}
```

**POST /api/instances/[id]/pairing/approve**
```typescript
// Request
{
  "channel": "telegram",
  "code": "ABC123"
}

// Response
{
  "data": {
    "success": true,
    "device_id": "hash"
  }
}
```

---

## 8. Database Migrations

### Migration 001: Initial Schema
```sql
-- 001_initial_schema.sql

-- Create molthome schema
CREATE SCHEMA IF NOT EXISTS molthome;

-- Grant usage to authenticated and anon roles
GRANT USAGE ON SCHEMA molthome TO authenticated, anon;

-- Set search path to include molthome schema
ALTER DATABASE postgres SET search_path TO molthome, public;

-- Users table
CREATE TABLE molthome.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  google_id TEXT UNIQUE,
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'pro')),
  paddle_customer_id TEXT,
  paddle_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('active', 'paused', 'cancelled', 'none')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instances table
CREATE TABLE molthome.instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES molthome.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gcp_instance_name TEXT UNIQUE NOT NULL,
  zone TEXT NOT NULL DEFAULT 'us-central1-a',
  machine_type TEXT NOT NULL DEFAULT 'e2-small',
  status TEXT DEFAULT 'provisioning',
  external_ip TEXT,
  gateway_token TEXT NOT NULL,
  deployment_log JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Channels table
CREATE TABLE molthome.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID REFERENCES molthome.instances(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('telegram', 'discord')),
  config JSONB NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys table
CREATE TABLE molthome.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES molthome.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('anthropic')),
  encrypted_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON molthome.users(email);
CREATE INDEX idx_users_google_id ON molthome.users(google_id);
CREATE INDEX idx_instances_user_id ON molthome.instances(user_id);
CREATE INDEX idx_instances_status ON molthome.instances(status);
CREATE INDEX idx_channels_instance_id ON molthome.channels(instance_id);
CREATE INDEX idx_api_keys_user_id ON molthome.api_keys(user_id);

-- Enable RLS on all tables
ALTER TABLE molthome.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE molthome.instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE molthome.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE molthome.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON molthome.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON molthome.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own instances" ON molthome.instances
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage channels via instance" ON molthome.channels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM molthome.instances
      WHERE instances.id = channels.instance_id
      AND instances.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own API keys" ON molthome.api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION molthome.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO molthome.users (id, email, name, avatar_url, google_id)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'provider_id'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION molthome.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON molthome.users
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_updated_at();

CREATE TRIGGER instances_updated_at
  BEFORE UPDATE ON molthome.instances
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_updated_at();

CREATE TRIGGER channels_updated_at
  BEFORE UPDATE ON molthome.channels
  FOR EACH ROW EXECUTE FUNCTION molthome.handle_updated_at();

-- Grant table permissions for RLS to work with custom schema
GRANT ALL ON ALL TABLES IN SCHEMA molthome TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA molthome TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA molthome TO anon;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA molthome
  GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA molthome
  GRANT ALL ON SEQUENCES TO authenticated;
```

---

## 9. Environment Variables

### Local Development (`.env.local`)
```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# GCP
GCP_PROJECT_ID=molthome-486509
GCP_REGION=us-central1
GCP_ZONE=us-central1-a
GCP_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Paddle
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_xxx
PADDLE_API_KEY=xxx
PADDLE_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_PADDLE_PRICE_STARTER=pri_xxx
NEXT_PUBLIC_PADDLE_PRICE_PRO=pri_xxx

# Encryption
ENCRYPTION_KEY=32-byte-random-key

# Optional
RESEND_API_KEY=re_xxx
```

### Production (Vercel Environment Variables)
Same as above with production values.

---

## 10. Deployment

### Vercel Setup

1. **Connect Repository**
   - Link GitHub repo to Vercel
   - Configure automatic deployments on push to `main`

2. **Environment Variables**
   - Add all env vars from section 9
   - Set `NODE_ENV=production`

3. **Build Settings**
   ```
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

4. **Domain**
   - Add custom domain (e.g., `app.molthome.com`)
   - Configure DNS

### Supabase Production

1. Create production Supabase project
2. Run migrations
3. Configure Google OAuth with production URLs
4. Update environment variables

### Paddle Production

1. Switch to production mode
2. Create production products/prices
3. Update webhook URL to production
4. Test with real payment

### GCP Production

1. Create production service account
2. Set up dedicated GCP project for user instances
3. Configure billing alerts
4. Set up monitoring

---

## 11. Post-Launch Tasks

- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (Mixpanel/PostHog)
- [ ] Create status page
- [ ] Write documentation
- [ ] Set up customer support (Intercom/Crisp)
- [ ] Create onboarding emails
- [ ] Set up backup strategy
