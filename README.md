# explorer_backend

To install dependencies:

Explorer Backend – Bun + Prisma + TypeScript + Elysia

Backend ringan menggunakan Bun, Prisma ORM, TypeScript, dan ElysiaJS.
Repository ini sudah siap digunakan untuk menjalankan API dengan MySQL.

🚀 Tech Stack

Bun (runtime super cepat)
TypeScript
Prisma ORM v6.19
MySQL
ElysiaJS (server router minimalis)
dotenv

📦 Instalasi Dependency:
bun --version
bun install

Gunakan wsl:
wsl -d Ubuntu -u root

buat password linux nya contoh nama linux "rp-linux"

ketik: passwd rp-linux
nanti muncul
New password: [isi password anda]

Struktur:
explorer_backend/
├── prisma/
│   ├── schema.prisma
│   └── prisma.config.ts
│   └── seed.ts
├── src/
│   ├── routes/
│      ├── folder.ts
│   ├── services/
│      ├── folderService.ts
│   ├── utils/
│      ├── serialize.ts
│   ├── server.ts
├── .env
├── tsconfig.json
├── package.json
└── README.md

.env (sample):
DATABASE_URL="mysql://root:@127.0.0.1:3306/explorer_db"  [sample db tanpa password]
PORT=7001


Prisma Setup:
- Generate Prisma Client:
    bunx prisma generate

- init migrate:
    bunx prisma migrate dev --name init

- Migrate reset database existing
    bunx prisma migrate reset

- db push
    bunx prisma db push

atau menggunakan prisma.config.ts:
bunx prisma migrate dev --name init --config ./prisma/prisma.config.ts