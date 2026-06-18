# Supabase Configuration

## Status: ✅ Configured

**Project ID**: `owyipxfkticgwgmvguse`
**Database**: PostgreSQL (Supabase)
**Schema**: Identical to Neon (11 models)

## Local Setup

```bash
# Create .env.local with:
DATABASE_URL="postgresql://postgres:dvdQ2tFx!!P/H!B@db.owyipxfkticgwgmvguse.supabase.co:5432/postgres"
NEXTAUTH_SECRET="jzs7igWSkIp0RZ8XRZxJmDU09TA1AVcpOto4GFJM2CjC"
NEXTAUTH_URL="http://localhost:3000"

# Install & run
npm install
npm run dev
```

## Vercel Deployment

1. Go to https://vercel.com/dashboard
2. **"Add New"** → **"Project"**
3. Select **`NutriFuel-v2`** repo
4. **Environment Variables** (add these 3):
   ```
   DATABASE_URL=postgresql://postgres:dvdQ2tFx!!P/H!B@db.owyipxfkticgwgmvguse.supabase.co:5432/postgres
   NEXTAUTH_SECRET=jzs7igWSkIp0RZ8XRZxJmDU09TA1AVcpOto4GFJM2CjC
   NEXTAUTH_URL=https://[your-vercel-domain].vercel.app
   ```
5. Click **"Deploy"**
6. Wait 2-3 min for deployment
7. Vercel will auto-run: `prisma migrate deploy`

## What Happens on Deploy

```
1. npm install
2. prisma generate (type-safe client)
3. prisma migrate deploy (create tables in Supabase)
4. npm run build (Next.js build)
5. Upload to Vercel
```

## Verify in Supabase

After deploy:
1. Go to https://app.supabase.com/project/owyipxfkticgwgmvguse
2. SQL Editor → Check tables exist:
   - users, goals, meals, weight_logs, assignments, etc.

## That's it! 

Your NutriFuel app is now on Supabase + Vercel 🚀
