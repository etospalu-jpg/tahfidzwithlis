# TahfidzWithLis

Platform full-stack untuk monitoring tahfidz: siswa, setoran, murajaah, target, catatan guru, halaqah, dan laporan.

## Stack

- Next.js + TypeScript
- Vercel
- Neon PostgreSQL
- Neon Managed Better Auth
- Tailwind CSS
- PWA shell

## Environment

Buat environment variables berikut di runtime/deployment:

```bash
DATABASE_URL=...
NEON_AUTH_BASE_URL=...
NEON_AUTH_COOKIE_SECRET=...
```

Jangan commit nilai secret ke repository.

## Core routes

- `/auth/sign-in`
- `/auth/sign-up` — hanya untuk bootstrap akun pertama
- `/setup` — finalisasi Super Admin pertama
- `/dashboard`
- `/students`
- `/students/[id]`
- `/setoran`
- `/reports`
- `/settings`

## Access model

Akun pertama menyelesaikan setup sebagai `super_admin`. Pembuatan akun lanjutan akan dikelola dari admin workspace pada fase berikutnya.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm start
```
