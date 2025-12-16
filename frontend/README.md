Frontend setup (React + Vite, .jsx)

1. Install:
   cd frontend
   npm install
2. Copy `.env.example` to `.env` and set VITE_API_URL (e.g.http://localhost:5000).
3. Run dev server:
   npm run dev

Notes:
- Admin protected endpoints: /admin/dashboard, /admin/analytics (frontend sends Authorization header automatically if token saved)
- Token saved in localStorage key: admin_token
