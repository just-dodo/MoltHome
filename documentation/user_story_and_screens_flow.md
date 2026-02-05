# User Stories & Screen Flows

## MoltHome - OpenClaw Gateway Deployment Platform

**Version:** 1.0
**Date:** 2026-02-05

---

## Table of Contents

1. [User Stories](#1-user-stories)
2. [Screen Inventory](#2-screen-inventory)
3. [Screen Flows](#3-screen-flows)
4. [Detailed Screen Specifications](#4-detailed-screen-specifications)

---

## 1. User Stories

### 1.1 Authentication & Onboarding

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-001 | As a new user, I want to sign up with my Google account so that I can quickly start using the platform | - Google OAuth button on landing page<br>- Automatic account creation on first login<br>- Redirect to plan selection after signup |
| US-002 | As a returning user, I want to sign in with Google so that I can access my dashboard | - Google OAuth button on login page<br>- Redirect to dashboard after login<br>- Session persists across browser sessions |
| US-003 | As a new user, I want to select a subscription plan so that I can access the platform | - Plan comparison page after signup<br>- Paddle checkout integration<br>- Redirect to instance creation after payment |
| US-004 | As a new user, I want to create my first instance immediately after subscribing so that I can start using the service right away | - Instance wizard shown after checkout<br>- Cannot skip on first signup<br>- Redirect to dashboard after deployment |
| US-005 | As a user, I want to log out so that I can secure my account | - Logout button in header<br>- Clear session on logout<br>- Redirect to landing page |

### 1.2 Subscription & Billing

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-010 | As a new user, I want to subscribe to a plan so that I can start using the service | - Plan comparison page<br>- Paddle checkout integration<br>- Immediate access after payment |
| US-012 | As a subscriber, I want to upgrade my plan so that I can have more instances | - Upgrade button in billing page<br>- Prorated billing<br>- Immediate access to new limits |
| US-013 | As a subscriber, I want to downgrade my plan so that I can reduce costs | - Downgrade option in billing<br>- Effective at next billing cycle<br>- Warning if over new limits |
| US-014 | As a subscriber, I want to cancel my subscription so that I can stop being charged | - Cancel button in billing<br>- Access until end of billing period<br>- Confirmation dialog |
| US-015 | As a subscriber, I want to view my invoices so that I can track expenses | - Invoice list with dates and amounts<br>- PDF download option<br>- Payment status |

### 1.3 Instance Management

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-020 | As a user, I want to create a new instance so that I can deploy my AI assistant | - Create button in dashboard<br>- Step-by-step wizard<br>- Progress indicator during deployment |
| US-021 | As a user, I want to see all my instances so that I can manage them | - List view of all instances<br>- Status indicator for each<br>- Quick actions (start/stop) |
| US-022 | As a user, I want to start a stopped instance so that my bot comes online | - Start button on instance card<br>- Loading state during startup<br>- Status updates to "Running" |
| US-023 | As a user, I want to stop a running instance so that I can save resources | - Stop button on instance card<br>- Confirmation dialog<br>- Status updates to "Stopped" |
| US-024 | As a user, I want to restart an instance so that I can apply configuration changes | - Restart button on instance card<br>- Brief downtime indicator<br>- Status returns to "Running" |
| US-025 | As a user, I want to delete an instance so that I can remove unused deployments | - Delete button with confirmation<br>- Warning about data loss<br>- Instance removed from list |
| US-026 | As a user, I want to view instance details so that I can see configuration and status | - Detail page for each instance<br>- Configuration summary<br>- Real-time status |
| US-027 | As a user, I want to name my instance so that I can identify it easily | - Name field in creation wizard<br>- Editable name in settings<br>- Name shown in list |

### 1.4 Configuration

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-030 | As a user, I want to add my Anthropic API key so that my bot can use Claude | - Secure input field<br>- Key validation<br>- Encrypted storage |
| US-031 | As a user, I want to connect Telegram so that my bot works on Telegram | - Input field for bot token<br>- Validation of token format<br>- Connection status shown |
| US-032 | As a user, I want to connect Discord so that my bot works on Discord | - Input field for bot token<br>- Validation of token format<br>- Connection status shown |
| US-033 | As a user, I want to view my gateway token so that I can access the Control UI | - Token display (masked by default)<br>- Copy button<br>- Regenerate option |
| US-034 | As a user, I want to regenerate my gateway token so that I can secure my instance | - Regenerate button<br>- Confirmation dialog<br>- Old token invalidated |

### 1.5 Channel & Pairing

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-040 | As a user, I want to see connected channels so that I know where my bot is active | - List of channels per instance<br>- Status for each channel<br>- Add/remove options |
| US-041 | As a user, I want to approve pairing requests so that authorized users can chat with my bot | - List of pending requests<br>- Approve/reject buttons<br>- Device info shown |
| US-042 | As a user, I want to view paired devices so that I know who has access | - List of paired devices<br>- Device details (platform, date)<br>- Revoke option |
| US-043 | As a user, I want to revoke a paired device so that I can remove access | - Revoke button per device<br>- Confirmation dialog<br>- Device removed from list |

### 1.6 Monitoring

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-050 | As a user, I want to view instance logs so that I can debug issues | - Log viewer with recent entries<br>- Auto-refresh option<br>- Search/filter |
| US-051 | As a user, I want to see instance uptime so that I know reliability | - Uptime percentage display<br>- Uptime history graph<br>- Incident indicators |
| US-052 | As a user, I want to see message statistics so that I know usage | - Message count (daily/weekly/monthly)<br>- Usage graph<br>- Trend indicators |
| US-053 | As a user, I want to access the OpenClaw Control UI so that I can use advanced features | - "Open Control UI" button<br>- Auto-authentication or token copy<br>- Opens in new tab |

### 1.7 Settings & Account

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-060 | As a user, I want to view my profile so that I can see my account info | - Profile page with name/email<br>- Avatar from Google<br>- Account creation date |
| US-061 | As a user, I want to update my display name so that I can personalize my account | - Editable name field<br>- Save button<br>- Confirmation message |
| US-062 | As a user, I want to delete my account so that I can remove all my data | - Delete account button<br>- Multi-step confirmation<br>- All data deleted |
| US-063 | As a user, I want to manage my saved API keys so that I can reuse them across instances | - List of saved keys (masked)<br>- Add/remove keys<br>- Use in instance creation |

---

## 2. Screen Inventory

### 2.1 Public Pages (Unauthenticated)

| Screen | Route | Description |
|--------|-------|-------------|
| Landing Page | `/` | Marketing page with value props and CTA |
| Login | `/login` | Google OAuth login |
| Pricing | `/pricing` | Plan comparison (public view) |

### 2.2 Onboarding Pages (New Users)

| Screen | Route | Description |
|--------|-------|-------------|
| Select Plan | `/onboarding/plan` | Plan selection for new users |
| Checkout | `/onboarding/checkout` | Paddle checkout integration |
| Create First Instance | `/onboarding/instance` | Instance creation wizard (required) |
| Deploying | `/onboarding/deploying` | Deployment progress |
| Success | `/onboarding/success` | Welcome + redirect to dashboard |

### 2.3 Authenticated Pages (With Subscription)

| Screen | Route | Description |
|--------|-------|-------------|
| Dashboard | `/dashboard` | List of user's instances |
| New Instance - Step 1 | `/dashboard/new` | Instance name & region |
| New Instance - Step 2 | `/dashboard/new?step=2` | API key configuration |
| New Instance - Step 3 | `/dashboard/new?step=3` | Channel setup |
| New Instance - Step 4 | `/dashboard/new?step=4` | Review & deploy |
| New Instance - Deploying | `/dashboard/new?step=deploying` | Deployment progress |
| Instance Detail | `/dashboard/[id]` | Instance overview |
| Instance Logs | `/dashboard/[id]/logs` | Log viewer |
| Instance Settings | `/dashboard/[id]/settings` | Instance configuration |
| Instance Channels | `/dashboard/[id]/channels` | Channel management |
| Instance Pairing | `/dashboard/[id]/pairing` | Device pairing |
| Settings | `/settings` | User settings |
| Settings - Profile | `/settings/profile` | Profile management |
| Settings - API Keys | `/settings/api-keys` | Saved API keys |
| Billing | `/billing` | Subscription management |
| Billing - Plans | `/billing/plans` | Plan selection |
| Billing - Invoices | `/billing/invoices` | Invoice history |

### 2.4 Modals & Overlays

| Modal | Trigger | Description |
|-------|---------|-------------|
| Confirm Delete Instance | Delete button | Confirmation with warning |
| Confirm Stop Instance | Stop button | Brief confirmation |
| Regenerate Token | Regenerate button | Confirmation with warning |
| Add Channel | Add channel button | Channel type & token input |
| Approve Pairing | Approve button | Device details & confirm |
| Cancel Subscription | Cancel button | Confirmation with info |

---

## 3. Screen Flows

### 3.1 New User Signup Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│   Google    │────▶│   Select    │────▶│   Paddle    │
│    Page     │     │   OAuth     │     │    Plan     │     │  Checkout   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                                                            │
      │                                                            ▼
      │                                                     ┌─────────────┐
      │                                                     │  Create 1st │
      │                                                     │  Instance   │
      │                                                     │  (Wizard)   │
      │                                                     └─────────────┘
      │                                                            │
      ▼                                                            ▼
┌─────────────┐                                             ┌─────────────┐
│   Pricing   │ (view plans before signup)                  │  Dashboard  │
│    Page     │                                             │ (1 instance)│
└─────────────┘                                             └─────────────┘
```

> **Note:** New users are immediately taken to the instance creation wizard after checkout. They cannot skip this step on first signup.

### 3.2 Instance Creation Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Dashboard  │────▶│  Step 1:    │────▶│  Step 2:    │────▶│  Step 3:    │
│             │     │  Basic Info │     │  API Key    │     │  Channels   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │                   │                   │
                          │ Back              │ Back              │ Back
                          ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │  Dashboard  │     │   Step 1    │     │   Step 2    │
                    └─────────────┘     └─────────────┘     └─────────────┘

                                                                  │
                                                                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Instance   │◀────│  Deploying  │◀────│  Step 4:    │◀────│  Step 3     │
│   Detail    │     │  Progress   │     │  Review     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │
                          │ (on error)
                          ▼
                    ┌─────────────┐
                    │   Error     │
                    │   Screen    │
                    └─────────────┘
```

### 3.3 Instance Management Flow

```
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       │ Click instance
       ▼
┌─────────────┐     ┌─────────────┐
│  Instance   │────▶│    Logs     │
│   Detail    │     │   Viewer    │
└──────┬──────┘     └─────────────┘
       │
       ├────────────────────────────────┐
       │                                │
       ▼                                ▼
┌─────────────┐                  ┌─────────────┐
│  Settings   │                  │  Channels   │
│    Tab      │                  │    Tab      │
└─────────────┘                  └──────┬──────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │   Pairing   │
                                 │    Tab      │
                                 └─────────────┘
```

### 3.4 Subscription Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  New User   │────▶│  Billing    │────▶│   Paddle    │────▶│  Dashboard  │
│  Signup     │     │   Plans     │     │  Checkout   │     │ (Subscribed)│
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │
                          │ Already subscribed
                          ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Billing    │────▶│  Invoices   │
                    │  Overview   │     │   List      │
                    └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │  Change     │
                    │   Plan      │
                    └─────────────┘
```

### 3.5 Pairing Approval Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User sends │────▶│  Pairing    │────▶│  Pending    │
│  message to │     │  code shown │     │  request    │
│  Telegram   │     │  in chat    │     │  in UI      │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                          ┌───────────────────┴───────────────────┐
                          │                                       │
                          ▼                                       ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │  Approve    │                         │   Reject    │
                    │  Modal      │                         │   Modal     │
                    └──────┬──────┘                         └──────┬──────┘
                           │                                       │
                           ▼                                       ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │  Device     │                         │  Request    │
                    │  Paired     │                         │  Rejected   │
                    └─────────────┘                         └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  User can   │
                    │  now chat   │
                    └─────────────┘
```

---

## 4. Detailed Screen Specifications

### 4.1 Landing Page (`/`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                                    [Pricing] [Login]       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    Deploy Your AI Assistant                             │
│                       in Minutes, Not Hours                             │
│                                                                         │
│         Create powerful AI bots for Telegram & Discord                  │
│              without any DevOps or cloud experience                     │
│                                                                         │
│                   [🔵 Get Started with Google]                          │
│                                                                         │
│                      Plans starting at $30/month                        │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│     ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│     │   🚀 Fast    │   │  🔒 Secure   │   │  💰 Simple  │             │
│     │              │   │              │   │              │             │
│     │ Deploy in    │   │ Your keys    │   │ One price,  │             │
│     │ under 5 min  │   │ encrypted    │   │ no surprises│             │
│     └──────────────┘   └──────────────┘   └──────────────┘             │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                         How It Works                                    │
│                                                                         │
│     1. Sign up ──▶ 2. Add API Key ──▶ 3. Connect Bot ──▶ 4. Chat!     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                           Pricing                                       │
│                                                                         │
│    ┌─────────────────┐         ┌─────────────────┐                     │
│    │    Starter      │         │      Pro        │                     │
│    │   $30/month     │         │   $100/month    │                     │
│    │                 │         │                 │                     │
│    │ • 1 instance    │         │ • 5 instances   │                     │
│    │ • 2 channels    │         │ • Unlimited     │                     │
│    │ • 5K messages   │         │ • 50K messages  │                     │
│    │                 │         │                 │                     │
│    │ [Subscribe]     │         │ [Subscribe]     │                     │
│    └─────────────────┘         └─────────────────┘                     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  © 2026 MoltHome          [Terms] [Privacy] [Contact]                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Header with logo, nav links, login button
- Hero section with headline and CTA
- Feature highlights (3 columns)
- How it works section
- Pricing cards
- Footer

**Actions:**
- "Get Started with Google" → Google OAuth → Dashboard
- "Login" → `/login`
- "Pricing" → Scroll to pricing section
- "Start Trial" → Google OAuth → Dashboard

---

### 4.2 Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                          [Settings] [Avatar ▼] [Logout]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  My Instances                                    [+ New Instance]       │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 🟢 Production Bot                                          [···]  │ │
│  │                                                                   │ │
│  │ 📱 Telegram: @MyProductionBot                                     │ │
│  │ 💬 Messages today: 142                                            │ │
│  │                                                                   │ │
│  │ Status: Running        Uptime: 99.8%        Created: 2 days ago   │ │
│  │                                                                   │ │
│  │ [Open Control UI]  [View Logs]  [⏹ Stop]                          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 🔴 Development Bot                                         [···]  │ │
│  │                                                                   │ │
│  │ 📱 Telegram: @MyDevBot                                            │ │
│  │ 💬 Messages today: 0                                              │ │
│  │                                                                   │ │
│  │ Status: Stopped        Uptime: --           Created: 5 days ago   │ │
│  │                                                                   │ │
│  │ [Open Control UI]  [View Logs]  [▶ Start]                         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Plan: Pro (2/5 instances)                    [Manage Subscription]     │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Header with user menu
- Instance list (cards)
- Each card shows: name, status, channels, quick stats, actions
- Plan/usage bar at bottom

**States:**
- Loading state → Skeleton cards
- Error state → Retry button

> **Note:** Dashboard always has at least one instance (created during onboarding).

**Actions:**
- "+ New Instance" → `/dashboard/new`
- Click instance card → `/dashboard/[id]`
- "Open Control UI" → Opens tunnel/external link
- "View Logs" → `/dashboard/[id]/logs`
- Start/Stop → API call + optimistic update
- "[···]" menu → Edit, Restart, Delete options

---

### 4.3 New Instance Wizard - Step 1 (`/dashboard/new`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                                              [✕ Cancel]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                        Create New Instance                              │
│                                                                         │
│        ● Step 1          ○ Step 2          ○ Step 3          ○ Step 4  │
│        Basic Info          API Key          Channels          Review    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Instance Name *                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ My Awesome Bot                                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  Give your instance a memorable name                                    │
│                                                                         │
│                                                                         │
│  Region                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🇺🇸 US Central (Iowa)                                      ▼   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  Choose a region close to your users for best performance               │
│                                                                         │
│                                                                         │
│                                                                         │
│                                                                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                    [Cancel]  [Next →]   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Fields:**
- Instance name (required, 3-50 chars)
- Region dropdown (us-central1, us-east1, europe-west1, asia-east1)

**Validation:**
- Name: required, unique per user, alphanumeric + spaces
- Region: required selection

---

### 4.4 New Instance Wizard - Step 2 (API Key)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                                              [✕ Cancel]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                        Create New Instance                              │
│                                                                         │
│        ✓ Step 1          ● Step 2          ○ Step 3          ○ Step 4  │
│        Basic Info          API Key          Channels          Review    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Anthropic API Key *                                                    │
│                                                                         │
│  ○ Use saved key                                                        │
│     ┌─────────────────────────────────────────────────────────────┐    │
│     │ sk-ant-••••••••••••••••7CKQ (added 2 days ago)          ▼   │    │
│     └─────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ● Enter new key                                                        │
│     ┌─────────────────────────────────────────────────────────────┐    │
│     │ sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx                   │    │
│     └─────────────────────────────────────────────────────────────┘    │
│     □ Save this key for future instances                                │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ 💡 Don't have an API key?                                       │    │
│  │    Get one at console.anthropic.com                             │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                  [← Back]  [Next →]     │
└─────────────────────────────────────────────────────────────────────────┘
```

**Fields:**
- Radio: Use saved key / Enter new key
- Dropdown of saved keys (if any)
- Text input for new key
- Checkbox to save new key

**Validation:**
- Key format: starts with `sk-ant-`
- Key is validated via API call (optional)

---

### 4.5 New Instance Wizard - Step 3 (Channels)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                                              [✕ Cancel]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                        Create New Instance                              │
│                                                                         │
│        ✓ Step 1          ✓ Step 2          ● Step 3          ○ Step 4  │
│        Basic Info          API Key          Channels          Review    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Connect Messaging Channels                                             │
│  Add at least one channel to communicate with your bot                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 📱 Telegram                                              [Added ✓] │ │
│  │                                                                   │ │
│  │ Bot Token                                                         │ │
│  │ ┌───────────────────────────────────────────────────────────────┐ │ │
│  │ │ 123456789:ABCdefGHIjklMNOpqrsTUVwxyz                          │ │ │
│  │ └───────────────────────────────────────────────────────────────┘ │ │
│  │                                                          [Remove] │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 💬 Discord                                              [+ Add]   │ │
│  │                                                                   │ │
│  │ Connect your Discord bot to this instance                         │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 💚 WhatsApp                                        [Coming Soon]  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                  [← Back]  [Next →]     │
└─────────────────────────────────────────────────────────────────────────┘
```

**Fields:**
- Expandable sections for each channel type
- Token input when expanded
- Add/Remove buttons

**Validation:**
- At least one channel required
- Token format validation per channel type

---

### 4.6 New Instance Wizard - Step 4 (Review)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                                              [✕ Cancel]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                        Create New Instance                              │
│                                                                         │
│        ✓ Step 1          ✓ Step 2          ✓ Step 3          ● Step 4  │
│        Basic Info          API Key          Channels          Review    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Review Your Configuration                                              │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Instance Name        My Awesome Bot                        [Edit] │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ Region               🇺🇸 US Central (Iowa)                 [Edit] │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ API Key              sk-ant-••••••••••••7CKQ               [Edit] │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ Channels             📱 Telegram: @MyAwesomeBot            [Edit] │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ 💰 Estimated Cost                                                 │ │
│  │                                                                   │ │
│  │ Instance:        ~$12/month (GCP compute)                         │ │
│  │ Your Plan:       Pro ($25/month)                                  │ │
│  │                                                                   │ │
│  │ Note: API costs (Anthropic) are billed separately                 │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                              [← Back]  [🚀 Deploy]      │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Summary table with edit links
- Cost estimation box
- Deploy button (prominent)

**Actions:**
- Edit links → Go to respective step
- Deploy → Start deployment, show progress

---

### 4.7 Deployment Progress

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                        Deploying Your Instance                          │
│                                                                         │
│                              🚀                                         │
│                                                                         │
│                    My Awesome Bot                                       │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  ✓ Creating VM instance                                           │ │
│  │  ✓ Installing dependencies                                        │ │
│  │  ● Building container...                                          │ │
│  │  ○ Starting gateway                                               │ │
│  │  ○ Connecting channels                                            │ │
│  │                                                                   │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░   │ │
│  │                         60%                                       │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│                 This usually takes 2-3 minutes                          │
│                                                                         │
│                 Please don't close this window                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Step checklist with status icons
- Progress bar
- Estimated time remaining

**States:**
- In progress → Animated progress
- Success → Show success screen (for onboarding) or redirect to instance detail
- Error → Show error message + retry button

---

### 4.8 Onboarding Success (`/onboarding/success`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                              🎉                                         │
│                                                                         │
│                    You're All Set!                                      │
│                                                                         │
│            Your AI assistant is now live and ready to chat              │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │   Instance: My Awesome Bot                                        │ │
│  │   Channel:  📱 Telegram @MyAwesomeBot                             │ │
│  │   Status:   🟢 Running                                            │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│                      What's Next?                                       │
│                                                                         │
│    1. Open Telegram and message @MyAwesomeBot                          │
│    2. Enter the pairing code when prompted                             │
│    3. Start chatting with your AI assistant!                           │
│                                                                         │
│                                                                         │
│                    [Go to Dashboard]                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Success celebration
- Instance summary card
- Next steps guide
- CTA to dashboard

**Auto-redirect:** After 10 seconds, auto-redirect to dashboard

---

### 4.9 Instance Detail (`/dashboard/[id]`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                          [Settings] [Avatar ▼] [Logout]    │
├─────────────────────────────────────────────────────────────────────────┤
│  ← Back to Dashboard                                                    │
│                                                                         │
│  My Awesome Bot                                    🟢 Running           │
│                                                                         │
│  [Overview]  [Channels]  [Pairing]  [Logs]  [Settings]                 │
│  ━━━━━━━━━━                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ Quick Actions               │  │ Gateway Token                   │  │
│  │                             │  │                                 │  │
│  │ [Open Control UI]           │  │ ••••••••••••••••••••            │  │
│  │ [⏹ Stop Instance]           │  │                                 │  │
│  │ [🔄 Restart]                │  │ [👁 Show]  [📋 Copy]            │  │
│  └─────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Statistics (Last 7 Days)                                         │   │
│  │                                                                  │   │
│  │  Messages        Uptime           API Calls                      │   │
│  │    1,234          99.8%             856                          │   │
│  │   ↑ 12%          ━━━━━━━━          ↑ 8%                          │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │     📊 Message Volume                                     │   │   │
│  │  │  200│    ▄                                                │   │   │
│  │  │  150│   ▄█▄    ▄                                          │   │   │
│  │  │  100│  ▄███▄  ▄█▄  ▄                                      │   │   │
│  │  │   50│ ▄█████▄▄███▄▄█▄▄                                    │   │   │
│  │  │     └─────────────────────────────                        │   │   │
│  │  │      Mon Tue Wed Thu Fri Sat Sun                          │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Connected Channels                                               │   │
│  │                                                                  │   │
│  │  📱 Telegram    @MyAwesomeBot      🟢 Connected                 │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tabs:**
- Overview (default) - Quick actions, stats, channels summary
- Channels - Manage connected channels
- Pairing - Manage paired devices
- Logs - Log viewer
- Settings - Instance configuration

---

### 4.10 Billing Page (`/billing`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🦞 MoltHome                          [Settings] [Avatar ▼] [Logout]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Billing & Subscription                                                 │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Current Plan                                                      │ │
│  │                                                                   │ │
│  │  PRO PLAN                                          $100/month     │ │
│  │                                                                   │ │
│  │  • 5 instances (2 used)                                           │ │
│  │  • Unlimited channels                                             │ │
│  │  • 50,000 messages/month (12,340 used)                           │ │
│  │                                                                   │ │
│  │  Next billing date: March 5, 2026                                 │ │
│  │                                                                   │ │
│  │  [Change Plan]  [Cancel Subscription]                             │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Usage This Month                                                  │ │
│  │                                                                   │ │
│  │  Instances    ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    2/5       │ │
│  │  Messages     █████████████░░░░░░░░░░░░░░░░░░░░░░░░░   12.3K/50K │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Recent Invoices                                    [View All →]   │ │
│  │                                                                   │ │
│  │  Feb 5, 2026    Pro Plan - Monthly      $25.00    ✓ Paid   [PDF] │ │
│  │  Jan 5, 2026    Pro Plan - Monthly      $25.00    ✓ Paid   [PDF] │ │
│  │  Dec 5, 2025    Pro Plan - Monthly      $25.00    ✓ Paid   [PDF] │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Payment Method                                                    │ │
│  │                                                                   │ │
│  │  💳 Visa ending in 4242                            [Update]       │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Mobile Responsiveness Notes

### Breakpoints
- Desktop: ≥1024px (full layout)
- Tablet: 768px-1023px (condensed sidebar)
- Mobile: <768px (bottom nav, stacked cards)

### Mobile Adaptations
- Dashboard: Single column instance cards
- Instance detail: Tabs become bottom navigation
- Wizard: Full-screen steps, sticky footer buttons
- Tables: Horizontal scroll or card view

---

## 6. Error States

### Common Error Screens

| Error | Screen | Action |
|-------|--------|--------|
| Instance creation failed | Wizard | Retry button, error details |
| Instance not responding | Detail page | Restart button, support link |
| Payment failed | Billing | Update payment method |
| Rate limit exceeded | Any | Wait message, upgrade prompt |
| API key invalid | Settings | Re-enter key |
| Session expired | Any | Re-login prompt |

---

## 7. Empty States

| Screen | Empty State Message | CTA |
|--------|---------------------|-----|
| Channels (none connected) | "No channels connected. Add one to start chatting!" | [Add Channel] |
| Paired devices (none) | "No devices paired yet. Share your bot to get started!" | How to pair guide |
| Invoices (none) | "No invoices yet. Your first invoice will appear after payment." | - |

> **Note:** Dashboard will never be empty since users must create their first instance during onboarding.
