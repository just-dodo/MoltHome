# Product Requirements Document: MoltHome

## OpenClaw Gateway Self-Service Deployment Platform

**Version:** 1.0
**Date:** 2026-02-05
**Author:** MoltHome Team
**Status:** Draft

---

## 1. Executive Summary

MoltHome is a web application that enables users to deploy and manage their own OpenClaw Gateway instances on a shared GCP infrastructure. Users can create personal AI assistant bots connected to Telegram, Discord, or other messaging platforms without managing infrastructure themselves.

### Vision
Democratize access to AI-powered personal assistants by providing a simple, self-service deployment platform that abstracts away the complexity of cloud infrastructure management.

### Key Value Propositions
- **Zero DevOps Required**: Users deploy instances with a few clicks
- **Cost Effective**: Shared infrastructure reduces per-user costs
- **Instant Setup**: From signup to working bot in under 5 minutes
- **Fully Managed**: Automatic updates, monitoring, and maintenance

---

## 2. Problem Statement

### Current Pain Points
1. **Technical Barrier**: Deploying OpenClaw requires knowledge of GCP, Docker, SSH, and CLI tools
2. **Cost Overhead**: Individual VM instances are expensive for light users
3. **Maintenance Burden**: Users must handle updates, monitoring, and troubleshooting
4. **Configuration Complexity**: Setting up channels, API keys, and pairing requires multiple manual steps

### Target Users
- **Non-technical users** who want AI assistants but lack DevOps skills
- **Small teams** needing shared AI bots without dedicated infrastructure
- **Developers** who want quick prototyping without infrastructure setup
- **Power users** managing multiple bots across different platforms

---

## 3. Goals and Success Metrics

### Goals
| Goal | Description |
|------|-------------|
| G1 | Enable non-technical users to deploy OpenClaw in < 5 minutes |
| G2 | Support 100+ concurrent instances on shared infrastructure |
| G3 | Achieve 99.5% uptime for deployed instances |
| G4 | Reduce per-user infrastructure cost by 60% vs individual VMs |

### Success Metrics (KPIs)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to First Bot | < 5 minutes | From signup to first Telegram message |
| Deployment Success Rate | > 95% | Successful deploys / Total attempts |
| Monthly Active Instances | 100+ | Instances with activity in last 30 days |
| User Retention (30-day) | > 70% | Users active after 30 days |
| Support Tickets per User | < 0.5/month | Tickets / Active users |

---

## 4. User Personas

### Persona 1: "Alex the Creator"
- **Role**: Content creator, non-technical
- **Goal**: Personal AI assistant on Telegram for productivity
- **Pain**: Can't navigate GCP console or terminal commands
- **Needs**: One-click deployment, simple dashboard, mobile access

### Persona 2: "Sam the Startup Founder"
- **Role**: Technical founder, time-constrained
- **Goal**: Quick AI bot prototype for team communication
- **Pain**: No time to manage infrastructure
- **Needs**: Fast setup, API access, team sharing features

### Persona 3: "Jordan the Developer"
- **Role**: Software developer, power user
- **Goal**: Multiple bots for different projects/clients
- **Pain**: Managing many individual instances is tedious
- **Needs**: Bulk management, CLI tools, custom configurations

---

## 5. Functional Requirements

### 5.1 User Management

| ID | Requirement | Priority |
|----|-------------|----------|
| UM-1 | Google OAuth login via Supabase | P0 |
| UM-2 | Automatic account creation on first login | P0 |
| UM-3 | User profile management | P1 |
| UM-4 | Account deletion with data cleanup | P1 |
| UM-5 | Session management (Supabase Auth) | P0 |

### 5.2 Instance Management

| ID | Requirement | Priority |
|----|-------------|----------|
| IM-1 | Create new OpenClaw instance | P0 |
| IM-2 | View list of user's instances | P0 |
| IM-3 | Start/Stop/Restart instance | P0 |
| IM-4 | Delete instance | P0 |
| IM-5 | View instance status (running, stopped, error) | P0 |
| IM-6 | View instance logs (last 100 lines) | P1 |
| IM-7 | Instance naming and tagging | P2 |
| IM-8 | Instance cloning/duplication | P2 |

### 5.3 Configuration Management

| ID | Requirement | Priority |
|----|-------------|----------|
| CM-1 | Set Anthropic API key (encrypted storage) | P0 |
| CM-2 | Add Telegram bot token | P0 |
| CM-3 | Add Discord bot token | P1 |
| CM-4 | View/regenerate gateway token | P0 |
| CM-5 | Configure instance tier (resources) | P1 |
| CM-6 | Set auto-restart policy | P2 |
| CM-7 | Custom environment variables | P2 |

### 5.4 Channel & Pairing Management

| ID | Requirement | Priority |
|----|-------------|----------|
| CP-1 | View connected channels | P0 |
| CP-2 | View pending pairing requests | P0 |
| CP-3 | Approve/reject pairing requests | P0 |
| CP-4 | Revoke paired devices | P1 |
| CP-5 | QR code display for WhatsApp pairing | P2 |

### 5.5 Monitoring & Analytics

| ID | Requirement | Priority |
|----|-------------|----------|
| MA-1 | Instance health status | P0 |
| MA-2 | Uptime percentage display | P1 |
| MA-3 | Message count (daily/weekly/monthly) | P1 |
| MA-4 | API usage metrics | P2 |
| MA-5 | Cost estimation display | P2 |
| MA-6 | Alerting on instance failures | P1 |

### 5.6 Billing & Quotas

| ID | Requirement | Priority |
|----|-------------|----------|
| BQ-1 | Paddle subscription integration | P0 |
| BQ-2 | Display current usage vs quota | P0 |
| BQ-3 | Upgrade prompts when approaching limits | P1 |
| BQ-4 | Usage-based billing option | P2 |
| BQ-5 | Invoice history | P1 |
| BQ-6 | Pause/cancel subscription | P0 |

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load time: < 2 seconds
- Instance creation time: < 3 minutes
- API response time: < 500ms (p95)
- Support 1000+ concurrent users

### 6.2 Security
- All secrets encrypted at rest (AES-256)
- All traffic over HTTPS
- API keys never exposed in frontend
- Rate limiting on all endpoints
- CSRF protection
- Input validation and sanitization
- Audit logging for sensitive operations

### 6.3 Reliability
- 99.5% platform uptime
- Automatic instance recovery on failure
- Daily backups of user configurations
- Graceful degradation on GCP outages

### 6.4 Scalability
- Horizontal scaling of web tier
- Container orchestration for instances (考虑 Cloud Run or GKE)
- Database connection pooling
- CDN for static assets

---

## 7. System Architecture (High-Level)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users                                    │
│                    (Web Browser / Mobile)                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Web Application                              │
│                  (Next.js on Vercel)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Auth      │  │  Dashboard  │  │    API      │              │
│  │   Pages     │  │    UI       │  │  Routes     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
┌───────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Supabase    │  │  Secret Manager │  │   Task Queue    │
│ ┌───────────┐ │  │    (GCP)        │  │ (Cloud Tasks)   │
│ │  Auth     │ │  └─────────────────┘  └────────┬────────┘
│ │ (Google)  │ │                                │
│ ├───────────┤ │                                │
│ │ Database  │ │                                │
│ │(PostgreSQL│ │                                │
│ └───────────┘ │                                │
└───────────────┘                                │
                                                 ▼
                          ┌─────────────────────────────────────┐
                          │        Instance Manager             │
                          │      (Python Worker on Cloud Run)   │
                          │                                     │
                          │  ┌─────────────────────────────┐   │
                          │  │  deploy_openclaw.py         │   │
                          │  │  (Functions from script)    │   │
                          │  └─────────────────────────────┘   │
                          └─────────────────┬───────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GCP Compute Engine                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Instance 1│  │Instance 2│  │Instance 3│  │Instance N│        │
│  │(User A)  │  │(User B)  │  │(User C)  │  │(User N)  │        │
│  │OpenClaw  │  │OpenClaw  │  │OpenClaw  │  │OpenClaw  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Data Model

### 8.1 Users Table
```
users
├── id (UUID, PK) -- matches Supabase auth.users.id
├── email (string, unique)
├── name (string)
├── avatar_url (string, nullable)
├── google_id (string, unique)
├── tier (enum: starter, pro)
├── paddle_customer_id (string, nullable)
├── paddle_subscription_id (string, nullable)
├── subscription_status (enum: active, paused, cancelled, none)
├── created_at (timestamp)
├── updated_at (timestamp)
└── deleted_at (timestamp, nullable)
```

### 8.2 Instances Table
```
instances
├── id (UUID, PK)
├── user_id (UUID, FK -> users)
├── name (string)
├── gcp_instance_name (string, unique)
├── zone (string)
├── machine_type (string)
├── status (enum: provisioning, running, stopped, error, deleted)
├── external_ip (string, nullable)
├── gateway_token_encrypted (string)
├── created_at (timestamp)
├── updated_at (timestamp)
└── deleted_at (timestamp, nullable)
```

### 8.3 Channels Table
```
channels
├── id (UUID, PK)
├── instance_id (UUID, FK -> instances)
├── type (enum: telegram, discord, whatsapp, slack)
├── config_encrypted (jsonb)  -- bot tokens, etc.
├── status (enum: active, inactive, error)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### 8.4 Secrets Table
```
secrets
├── id (UUID, PK)
├── user_id (UUID, FK -> users)
├── instance_id (UUID, FK -> instances, nullable)
├── type (enum: anthropic_api_key, anthropic_oauth_token)
├── value_encrypted (string)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### 8.5 Paired Devices Table
```
paired_devices
├── id (UUID, PK)
├── instance_id (UUID, FK -> instances)
├── device_id (string)
├── platform (string)
├── client_id (string)
├── status (enum: pending, approved, revoked)
├── approved_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### 8.6 Usage Logs Table
```
usage_logs
├── id (UUID, PK)
├── instance_id (UUID, FK -> instances)
├── event_type (enum: message_sent, message_received, api_call)
├── metadata (jsonb)
├── created_at (timestamp)
```

---

## 9. API Endpoints

### 9.1 Authentication (via Supabase)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/callback` | OAuth callback handler |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

> **Note:** Google OAuth flow is handled by Supabase Auth. Frontend uses `@supabase/auth-helpers-nextjs` for session management.

### 9.2 Instances
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/instances` | List user's instances |
| POST | `/api/instances` | Create new instance |
| GET | `/api/instances/:id` | Get instance details |
| PATCH | `/api/instances/:id` | Update instance |
| DELETE | `/api/instances/:id` | Delete instance |
| POST | `/api/instances/:id/start` | Start instance |
| POST | `/api/instances/:id/stop` | Stop instance |
| POST | `/api/instances/:id/restart` | Restart instance |
| GET | `/api/instances/:id/logs` | Get instance logs |
| GET | `/api/instances/:id/status` | Get real-time status |

### 9.3 Channels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/instances/:id/channels` | List channels |
| POST | `/api/instances/:id/channels` | Add channel |
| DELETE | `/api/instances/:id/channels/:channelId` | Remove channel |

### 9.4 Pairing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/instances/:id/pairing/pending` | List pending requests |
| POST | `/api/instances/:id/pairing/approve` | Approve pairing |
| POST | `/api/instances/:id/pairing/reject` | Reject pairing |
| GET | `/api/instances/:id/pairing/devices` | List paired devices |
| DELETE | `/api/instances/:id/pairing/devices/:deviceId` | Revoke device |

### 9.5 Secrets
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/secrets/anthropic` | Set Anthropic API key |
| DELETE | `/api/secrets/anthropic` | Remove Anthropic API key |
| GET | `/api/secrets/status` | Check which secrets are set |

---

## 10. User Interface

### 10.1 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page with signup CTA |
| Login | `/login` | Login form |
| Register | `/register` | Registration form |
| Dashboard | `/dashboard` | List of user's instances |
| New Instance | `/dashboard/new` | Instance creation wizard |
| Instance Detail | `/dashboard/:id` | Single instance management |
| Instance Logs | `/dashboard/:id/logs` | Log viewer |
| Settings | `/settings` | User settings, API keys |
| Billing | `/billing` | Subscription and usage |

### 10.2 Dashboard Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  MoltHome                              [Settings] [User ▼]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  My Instances                              [+ New Instance]      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 🟢 Production Bot                                        │    │
│  │    Telegram: @MyProductionBot                           │    │
│  │    Status: Running | Uptime: 99.8% | Messages: 1,234    │    │
│  │    [Open Dashboard] [Logs] [Stop] [···]                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 🟡 Dev Bot                                               │    │
│  │    Telegram: @MyDevBot                                  │    │
│  │    Status: Stopped | Last active: 2 hours ago           │    │
│  │    [Open Dashboard] [Logs] [Start] [···]                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │
│  │                                                         │    │
│  │     + Create your first instance                        │    │
│  │       Deploy an AI assistant in minutes                 │    │
│  │                                                         │    │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Usage: 2/5 instances | Pro Plan         [Manage Subscription]  │
└─────────────────────────────────────────────────────────────────┘
```

### 10.3 Instance Creation Wizard

**Step 1: Basic Info**
- Instance name
- Select region (auto-recommended)

**Step 2: AI Configuration**
- Enter Anthropic API key (or use saved)
- Select model tier (Sonnet/Opus)

**Step 3: Connect Channels**
- Add Telegram bot token
- Add Discord bot token (optional)
- Skip for now option

**Step 4: Review & Deploy**
- Summary of configuration
- Estimated cost
- Deploy button

**Step 5: Deployment Progress**
- Real-time progress indicator
- ~2-3 minute deployment
- Success screen with next steps

---

## 11. Pricing Tiers

### Starter Tier
- 1 instance
- 2 channels per instance
- 5,000 messages/month
- Email support
- **$30/month**

### Pro Tier
- 5 instances
- Unlimited channels
- 50,000 messages/month
- Priority email support
- Custom instance names
- **$100/month**


> **Note:** No free tier or trial. All users must subscribe to use the platform.

---

## 12. Security Considerations

### 12.1 Data Protection
- All API keys and tokens encrypted using GCP Secret Manager
- Database encryption at rest
- TLS 1.3 for all connections
- No plaintext secrets in logs

### 12.2 Access Control
- JWT-based authentication with short expiry (1 hour)
- Refresh token rotation
- Instance isolation (users can only access their own)
- Admin audit logging

### 12.3 Infrastructure Security
- VPC isolation for instances
- Firewall rules limiting instance access
- Regular security patches
- Vulnerability scanning

### 12.4 Compliance
- GDPR data deletion support
- Data export functionality
- Privacy policy and ToS

---

## 13. Rollout Plan

### Phase 1: MVP (Week 1-4)
- [ ] Google OAuth via Supabase
- [ ] Paddle subscription integration
- [ ] Create/delete instances
- [ ] Telegram channel support
- [ ] Basic dashboard UI
- [ ] Instance start/stop/restart

### Phase 2: Core Features (Week 5-8)
- [ ] Discord channel support
- [ ] Log viewing
- [ ] Pairing management UI
- [ ] Settings page
- [ ] Usage tracking

### Phase 3: Growth (Week 9-12)
- [ ] Advanced Paddle features (upgrades, downgrades)
- [ ] Usage-based billing option
- [ ] Referral program
- [ ] Usage alerts & notifications

### Phase 4: Polish (Week 13-16)
- [ ] Mobile-responsive UI
- [ ] Email notifications
- [ ] Documentation site
- [ ] Public launch
- [ ] Additional OAuth providers (GitHub, etc.)

---

## 14. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Should we use individual VMs or containerized approach (GKE/Cloud Run)? | Engineering | Open |
| 2 | What's the maximum instances per VM for cost optimization? | Engineering | Open |
| 3 | Do we need WhatsApp support in MVP? | Product | Open |
| 4 | Should users be able to bring their own GCP project? | Product | Open |
| 5 | What's the data retention policy for logs? | Legal | Open |

---

## 15. Appendix

### A. Glossary
- **Instance**: A single OpenClaw Gateway deployment
- **Channel**: A messaging platform connection (Telegram, Discord, etc.)
- **Pairing**: The process of authorizing a device to interact with the gateway
- **Gateway Token**: Secret key for authenticating with the OpenClaw Control UI

### B. References
- [OpenClaw Documentation](https://docs.openclaw.ai)
- [GCP Compute Engine Pricing](https://cloud.google.com/compute/pricing)
- [Anthropic API Documentation](https://docs.anthropic.com)

### C. Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-05 | MoltHome Team | Initial draft |
