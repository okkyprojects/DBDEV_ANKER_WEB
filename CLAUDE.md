# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Laravel 10 + Inertia.js + React monolith for a seller/marketplace admin platform ("Anker"): products, variants/stock, categories, brands, orders (pesanan), transactions, billing, banners, and role/permission-based user management. Route names, UI labels, and validation messages are largely in Indonesian (e.g. `pesanan`, `produk`, `informasi-pribadi`).

The app exposes two parallel surfaces from the same codebase:
- **Web (Inertia + React)**: server-rendered routes in `routes/web.php`, using `App\Http\Controllers\Admin\*` and `App\Http\Controllers\Seller\*`/`User\*` controllers that return `Inertia::render(...)`.
- **JSON API (Sanctum)**: routes in `routes/api.php`, using `App\Http\Controllers\API\*` controllers, for a separate consumer (e.g. a mobile/customer-facing client) covering auth (OTP-based register/login/reset), cart, checkout/transactions, addresses, and catalog browsing.

## Commands

### PHP / Laravel
- Install deps: `composer install`
- Run dev server: `php artisan serve`
- Run all tests: `php artisan test` or `vendor/bin/phpunit`
- Run a single test file: `vendor/bin/phpunit tests/Feature/Auth/AuthenticationTest.php`
- Run a single test method: `vendor/bin/phpunit --filter test_method_name tests/Feature/Auth/AuthenticationTest.php`
- Format PHP code (Laravel Pint): `vendor/bin/pint`
- Run migrations: `php artisan migrate`
- Run seeders: `php artisan db:seed`
- Tinker REPL: `php artisan tinker`

Test env config (`phpunit.xml`) uses the array session/cache/queue drivers but does **not** override `DB_CONNECTION`/`DB_DATABASE` to sqlite — tests run against whatever database is configured in `.env`, so a real MySQL database must be reachable when running the suite.

### JS / Frontend
- Install deps: `npm install`
- Dev server (Vite + HMR): `npm run dev`
- Production build: `npm run build`

There is no configured JS linter or test runner in `package.json` — don't assume `npm test`/`npm run lint` exist.

## Architecture

### Backend: Controller → Repository → Model, with a shared Response trait
Business logic does not live in controllers or models. The pattern is:
- **Controllers** (`app/Http/Controllers/{Admin,API,Seller,User}/*`) are thin: they apply `permission:*` middleware (Spatie Laravel Permission) per action in the constructor, delegate to a repository, and return either `Inertia::render(...)` (web) or a JSON response built via the repository (API).
- **Repositories** (`app/Http/Repositories/*Repository.php`) hold all the actual logic: validation (`Validator::make` + `ValidationException`, not Form Requests, for most CRUD), query building/filtering/pagination, file upload handling (`Storage::disk('public')`), and persistence (typically `updateOrCreate` keyed on `uuid`). Repositories are injected into controllers by type-hint (no interfaces/bindings — Laravel's container resolves the concrete class directly).
- **`App\Traits\Response`** is a trait injected into repositories (not controllers) to standardize JSON API envelopes (`{status, message, data}` with fixed HTTP codes) for the API surface — e.g. `notFound()`, `store()`, `destroy()`, `validationError()`. When adding a new API repository method, reuse the matching `Response` method instead of hand-rolling a JSON shape.
- Most domain models use a `uuid` (not the numeric `id`) as the public identifier in routes and repository lookups (e.g. `Route::delete('/data-produk/{uuid}', ...)`, `where('uuid', $uuid)`). `User`/`Role`/`Permission` records are the exception and are addressed by numeric `id`.
- Authorization is role/permission-based via `spatie/laravel-permission` (`config/permission.php`), checked with the `permission:{model}-{action}` middleware string (e.g. `permission:category-index`) applied per-method in each Admin controller's constructor — check existing controllers for the naming convention before adding new permission strings.

### Frontend: Inertia pages driven by server responses, Redux for cross-cutting state
- Entry point is `resources/js/app.jsx`, which sets up Inertia with `resolvePageComponent` resolving `Pages/{name}.jsx` against `import.meta.glob`, wrapped in a Redux `Provider` and a `CartProvider` (React context, `resources/js/Context/`).
- `resources/js/Pages/*` mirrors the backend feature areas (`Category`, `Brand`, `Bill`, `Stok`, `Pesanan`, `Reporting`, `Role`, `Permission`, `User`, `Seller`, etc.) — each controller's `Inertia::render('Feature/Index', ...)` call maps directly to `resources/js/Pages/Feature/Index.jsx`.
- `resources/js/Components/Modal/*` is organized by the same feature areas as `Pages`, since most CRUD in this app happens through modal forms rather than dedicated create/edit pages (note `product.create`/`product.edit` are exceptions with real pages).
- `resources/js/Store` holds Redux Toolkit (`@reduxjs/toolkit`) state; use it for state shared across pages/components rather than prop drilling through Inertia page props.
- Path alias `@/*` → `resources/js/*` is configured in `jsconfig.json` for editor tooling; Vite/Inertia resolve via relative `./Pages/...` globs in `app.jsx`, so this alias is for IDE intellisense, not a build-time requirement.
- Excel import/export (`app/Imports`, `app/Exports`, `maatwebsite/excel`) backs the various `export`/`import`/`downloadTemplate` endpoints (products, orders/pesanan, transactions).
