# NutriFuel v2

A premium multi-client nutrition and fitness coaching platform with role-based access control.

## ✨ Features

### Client Features
- **Meal Tracker**: Register daily meals from food database, track macros in real-time
- **MacroRings**: Visual SVG component showing progress toward daily macro goals
- **Weight Tracking**: Log weight with persistent history
- **Progress Photos**: Upload progress images
- **Workouts**: View assigned routines and mark exercises complete
- **Change Requests**: Request modifications to diet/routine, coach approves/rejects
- **Personal Dashboard**: Summary of nutrition and training progress

### Coach Features
- **Client Management**: Add clients, set individual macro goals
- **Custom Meals**: Create personalized meal plans from ingredient database
- **Assignments**: Assign diets and routines to clients
- **Client Dashboard**: View individual client data, adherence, progress photos
- **Business Reports**: KPIs (active clients, adherence %, monthly revenue)
- **Request Management**: Review and approve/reject client change requests

## 🏗 Architecture

```
Frontend: Next.js 15 App Router + TypeScript
Auth: NextAuth.js v5 (credentials provider)
Database: Vercel Postgres + Prisma ORM
Styling: Tailwind CSS + custom design tokens
Deployment: Vercel (auto-deploy from GitHub)
```

## 🗄 Database Schema

11 Models:
- **User**: coach/client with email+password auth
- **Goals**: daily macro targets per user
- **Food**: ingredient database
- **Meal**: daily meal registration
- **Routine**: workout plans
- **Exercise**: individual exercises in routines
- **WeightLog**: weight history
- **MealTemplate**: custom coach-created meal plans
- **Assignment**: diet/routine assignments to clients
- **ChangeRequest**: client requests, coach approval workflow
- **ClientSubscription**: plan tracking + billing

## 📋 Project Status

### ✅ PHASE 1: Foundation (Complete)
- Authentication (email+password+role)
- Meal tracker with food database
- MacroRings visualization
- Client/Coach dashboards
- Prisma database integration
- Shared navigation sidebar

### ✅ PHASE 2: Features (Complete - MVP)
- Custom meal templates (coach)
- API routes for all core features
- Weight logging
- Change request workflow
- Assignment system
- Client goals management
- Database persistence

### 📋 PHASE 3: Polish (Pending)
- Advanced analytics dashboard
- Email notifications (Resend)
- Photo uploads (Vercel Blob)
- Security hardening
- E2E testing
- Production deployment

## 🔌 API Routes (Complete)

### Meals
- `POST /api/meals` - register meal
- `GET /api/meals` - list meals
- `DELETE /api/meals?id=X` - remove

### Clients (Coach)
- `GET /api/clients` - list
- `POST /api/clients` - add
- `GET/PUT /api/clients/[id]/goals` - goals

### Weight
- `POST /api/weight` - log
- `GET /api/weight` - history

### Assignments
- `POST /api/assignments` - assign
- `GET /api/assignments` - list
- `DELETE /api/assignments?id=X` - remove

### Change Requests
- `POST /api/requests` - request
- `GET /api/requests` - list
- `PUT /api/requests?id=X` - approve/reject

## 🎨 Design

**Colors**: Gold `#C9A24B`, Dark `#0B0D10`, Macro accent colors
**Fonts**: Playfair Display (headers), Inter (body)
**Style**: Glassmorphism cards with gold borders

## 🚀 Next Steps

To get this running:

1. **Local Dev**: `npm install && npm run dev`
2. **Deploy**: Push to GitHub, Vercel auto-deploys
3. **Email**: Setup Resend API key for notifications
4. **Photos**: Setup Vercel Blob for photo uploads
5. **Test**: Create coach + client accounts, test workflows

## 📊 Commits Pushed

8 major commits covering:
- Foundation (auth, schema, navigation)
- UI (pages, MacroRings component)
- API routes (meals, clients, weight, assignments, requests)
- Database integration (Prisma queries)

**Ready for:** Testing, integration testing, production deployment

---

**Current Version**: MVP v1 with complete core functionality
