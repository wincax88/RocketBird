# AI Agent Instructions - RocketBird

## Project Context

You are working on **RocketBird**, a membership management system for fitness chain groups. The system consists of:

1. **H5 Member App** - Built with UniApp (Vue3) for members to access services
2. **Admin Dashboard** - Built with React + Ant Design for operations management
3. **Backend APIs** - Node.js cloud functions on Tencent Cloud TCB

## Key Directories

```
/openspec/
  ├── project.md          # Project overview and conventions
  ├── AGENTS.md           # This file - AI instructions
  ├── specs/              # Current specifications (source of truth)
  │   ├── member-auth/    # Authentication & registration
  │   ├── member-level/   # Member levels & benefits
  │   ├── points-system/  # Points earning & redemption
  │   ├── checkin-share/  # Check-in and sharing features
  │   ├── member-benefits/# Birthday/growth/new member gifts
  │   ├── fitness-meals/  # Daily fitness meal recommendations
  │   ├── referral/       # Friend referral system
  │   ├── admin-system/   # Admin dashboard & permissions
  │   ├── feedback-system/# User feedback management
  │   └── brand-content/  # Brand content CMS
  └── changes/            # Proposed changes (not yet deployed)
      └── archive/        # Completed changes
```

## Specification Format

When reading or writing specifications, follow this behavioral format:

```markdown
# Feature Name

## Overview
Brief description of the feature.

## Data Model
Database schema for this feature.

### Requirement: [Requirement Title]

#### Scenario: [Scenario Description]
**GIVEN** [precondition]
**WHEN** [action]
**THEN** [expected outcome]
**AND** [additional outcome]
```

## Development Guidelines

### When Implementing Features

1. **Read the spec first** - Check `openspec/specs/[feature]/spec.md` before coding
2. **Follow the data model** - Use the exact field names from specifications
3. **Match scenarios** - Implementation should satisfy all scenario requirements
4. **Check project.md** - Follow coding conventions defined there

### When Proposing Changes

1. Create a change folder in `openspec/changes/[change-name]/`
2. Include:
   - `proposal.md` - What and why
   - `delta.md` - Specific changes to existing specs
   - `tasks.md` - Implementation tasks

### API Conventions

- **Base URL**: TCB cloud function HTTP endpoints
- **Auth**: JWT token in Authorization header
- **Response Format**:
  ```json
  {
    "code": 0,
    "data": {},
    "message": "success"
  }
  ```

### Database Conventions

- Collection names: snake_case (e.g., `points_log`)
- Document IDs: String UUIDs
- Timestamps: ISO 8601 format
- Soft delete: Use `status` field, not physical deletion

## Business Domain Knowledge

### Member Types
- **潜客** (Prospect): Registered but not purchased
- **会籍会员** (Member): Purchased membership
- **活跃会员** (Active): Regular attendance
- **沉默会员** (Dormant): No activity for extended period

### Points Economy
- Points earned through: check-in, sharing, referrals, admin grants, event rewards
- Points spent on: merchandise redemption, service exchange
- Points rules are configurable in admin dashboard

### O2O Flow
The system bridges online (app) and offline (gym) experiences:
- Online: Registration, browsing, sharing, point redemption
- Offline: Check-in, training, events
- Data sync: Member data flows between brand app and core SaaS system

## Common Tasks

### Adding a New Feature
1. Review `openspec/project.md` for context
2. Check related specs in `openspec/specs/`
3. Create implementation following existing patterns
4. Update spec if behavior changes

### Fixing a Bug
1. Identify which spec defines the expected behavior
2. Verify the bug against spec scenarios
3. Fix to match specification
4. Add test case if missing

### Refactoring
1. Ensure all spec scenarios still pass
2. Don't change external behavior without spec update
3. Follow existing code patterns from project.md
