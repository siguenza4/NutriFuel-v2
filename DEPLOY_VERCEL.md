# Deploy a Vercel - Paso a Paso

## Paso 1: Obtén tus credenciales

### DATABASE_URL (Neon)
1. Ve a https://console.neon.tech
2. Selecciona proyecto `nutrifuel-db`
3. Connection String → copia la URL (empieza con `postgresql://`)
4. Asegúrate que esté completa incluyendo password

### VERCEL_TOKEN
1. Ve a https://vercel.com/account/tokens
2. Click "Create Token"
3. Nombre: `nutrifuel-deploy`
4. Copia el token (largo string)

### NEXTAUTH_SECRET
Genera con:
```bash
openssl rand -base64 33
```

---

## Paso 2: Comunica los valores

Pasa estos 3 valores:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=generated_value
VERCEL_TOKEN=vercel_xxx...
```

---

## Paso 3: Deploy Automático

Una vez tengas los valores, diré "ejecutar deploy" y haré:

1. Login a Vercel con tu token
2. Crear proyecto en Vercel
3. Configurar variables de entorno
4. Deploy automático
5. URL pública en ~2-3 minutos

---

## Alternativa Manual (sin CLI)

Si prefieres:
1. Ve a https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Selecciona repo `NutriFuel-v2`
4. Vercel auto-detecta Next.js
5. En "Environment Variables", agrega:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = tu dominio vercel (después lo sabrás)
6. Click "Deploy"
7. Listo en 2 minutos

---

**Status**: Listo para deploy. Esperando tus datos.
