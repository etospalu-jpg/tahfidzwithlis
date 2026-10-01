# TahfidzWithLis

Platform full-stack untuk monitoring tahfidz: siswa, setoran, murajaah, target, catatan guru, halaqah, dan laporan.

## Stack

- Next.js + TypeScript
- Vercel
- Neon PostgreSQL
- PIN-based admin access with signed httpOnly session
- Tailwind CSS
- PWA shell

## Environment

Deployment minimal hanya membutuhkan:

```bash
DATABASE_URL=...
```

Opsional:

```bash
ADMIN_SESSION_SECRET=...
```

Jika `ADMIN_SESSION_SECRET` tidak diisi, server memakai `DATABASE_URL` sebagai sumber secret untuk penandatanganan session cookie.

PIN admin tidak disimpan sebagai plaintext di repository. Hash PIN tersimpan di Neon pada `app_settings.admin_pin_hash`.

## Core routes

- `/auth/sign-in` — akses admin dengan PIN
- `/dashboard`
- `/students`
- `/students/[id]`
- `/setoran`
- `/reports`
- `/settings`

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
