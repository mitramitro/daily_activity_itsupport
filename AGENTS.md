# AGENTS.md — itapp

## Structure

```
itapp/
├── backend/     Laravel 12 API (PHP 8.2+, MySQL)
│   ├── app/Http/Controllers/Api/   API controllers
│   ├── app/Http/Middleware/         JwtMiddleware, RoleMiddleware
│   ├── app/Models/                  Eloquent models
│   ├── config/                      Laravel config (jwt.php, cors.php, auth.php)
│   ├── database/migrations/         DB migrations
│   ├── routes/api.php               All API routes under `/api`
│   └── tests/                       PHPUnit (Unit + Feature)
└── frontend/    React 19 SPA + Capacitor 8 Android app
    ├── src/
    │   ├── app/         App.jsx, Router.jsx, init/
    │   ├── contexts/    AuthContext.jsx
    │   ├── modules/     Feature-based pages (auth, dashboard, employees, inventory, task, users, reports, settings, profile)
    │   ├── services/    api.js (axios), storage.js (Preferences/localStorage)
    │   └── components/  Shared UI components
    └── capacitor.config.json   appId: com.itgenic.app, webDir: dist
```

## Backend — Laravel

### Auth
- JWT via `tymon/jwt-auth` — guard `api`, driver `jwt` (config in `config/auth.php`)
- Middleware `jwt` in `app/Http/Middleware/JwtMiddleware.php` — also accepts `?token=` query param for file downloads (e.g. `window.open`)
- Roles: `admin`, `user` — checked via `RoleMiddleware`
- Fingerprint auth flow: enable/disable endpoints + login via fingerprint token

### Dev commands (run from `backend/`)
```bash
composer dev          # runs php artisan serve + queue:listen + npm run dev concurrently
composer test         # php artisan config:clear + php artisan test
composer setup        # full first-time setup (composer install, .env, key, migrate, npm install, build)
```

### Testing
- PHPUnit in `backend/tests/Unit` and `backend/tests/Feature`
- Test DB: in-memory SQLite (set in `phpunit.xml`)
- Run: `composer test` or `php artisan test` or `./vendor/bin/phpunit`

### Linting / formatting
- Laravel Pint: `./vendor/bin/pint` (PSR-12 based)

### CORS
- Configured in `config/cors.php` — allows `api/*`, credentials, exposes `Content-Disposition` (for downloads)
- Allowed origins include `localhost:5173` (Vite dev), `localhost:3000`, `capacitor://localhost`, production domain

### Key packages
- `maatwebsite/excel` — report exports
- `tymon/jwt-auth` — JWT auth (TTL: 60min, refresh TTL: 20160min / 14 days)

## Frontend — React + Vite + Capacitor

### Dev commands (run from `frontend/`)
```bash
npm run dev       # Vite dev server
npm run build     # Vite production build
npm run lint      # ESLint
npm run preview   # Vite preview
```

### App entrypoint
- `src/main.jsx` renders `<AuthProvider><App /></AuthProvider>`
- `src/app/App.jsx` runs `initApp()` (Capacitor + keyboard init) on mount
- `src/app/App.jsx` renders `<Toaster>` (react-hot-toast) + `<RouterProvider>`
- Routes defined in `src/app/Router.jsx` — lazy-loaded pages via `Loadable` utility

### API client
- `src/services/api.js` — axios instance to `http://localhost:8000/api`
- Auto-injects Bearer token from storage
- On 401: attempts token refresh via `/auth/refresh`; queues concurrent requests; on failure clears token and triggers logout
- Network errors show toast

### Storage
- `src/services/storage.js` — abstracts Capacitor Preferences (native) / localStorage (web)
- Stores: token, user, deviceId, fingerprintToken, lastUserEmail

### Auth flow
- `AuthContext.jsx` manages login/logout/fingerprint state
- On mount: reads stored token, fetches `/auth/me` to restore session
- 401 handler is set globally to logout

### Capacitor
- Android only (currently)
- Biometric auth plugin installed
- Build: `npx cap sync android && npx cap open android`

### Build output
- `frontend/dist/` — served via Laravel's Vite config OR deployed independently

## General notes
- The `.env` contains a JWT_SECRET and APP_KEY — treat as sensitive
- Backend serves at `http://localhost:8000` (via `php artisan serve`)
- Frontend dev server runs at `http://localhost:5173` (Vite default)
- No existing CI workflows, opencode.json, or instruction files
