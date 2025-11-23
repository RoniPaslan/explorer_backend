# explorer_backend

Backend menggunakan **Bun + Prisma + TypeScript + Elysia**, ringan dan
siap dipakai untuk API berbasis MySQL.

## 🚀 Tech Stack

-   Bun (runtime super cepat)
-   TypeScript
-   Prisma ORM v6.19
-   MySQL
-   ElysiaJS (web server minimalis)
-   dotenv

## 📦 Instalasi Dependency

Cek versi Bun:

    bun --version

Install dependency:

    bun install

Jika menggunakan WSL:

    wsl -d Ubuntu -u root

Buat password Linux (contoh user: rp-linux):

    passwd rp-linux

## 📁 Struktur Folder

    explorer_backend/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── prisma.config.ts
    │   └── seed.ts
    ├── src/
    │   ├── routes/
    │   │   └── folder.ts
    │   ├── services/
    │   │   └── folderService.ts
    │   ├── utils/
    │   │   └── serialize.ts
    │   └── server.ts
    ├── .env
    ├── tsconfig.json
    ├── package.json
    └── README.md

## 🔧 File `.env` (contoh)

    DATABASE_URL="mysql://root:@127.0.0.1:3306/explorer_db"
    PORT=7001

## 🛠 Prisma Setup

### Generate Prisma Client

    bunx prisma generate

### Buat Migrasi Pertama

    bunx prisma migrate dev --name init

### Reset Database

    bunx prisma migrate reset

### Push schema tanpa migrasi

    bunx prisma db push

### Dengan prisma.config.ts

    bunx prisma migrate dev --name init --config ./prisma/prisma.config.ts
