import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Root folder
  const root = await prisma.folder.create({
    data: {
      name: "Root",
    },
  });

  // Subfolder contoh
  const sub1 = await prisma.folder.create({
    data: {
      name: "Documents",
      parentId: root.id,
    },
  });

  const sub2 = await prisma.folder.create({
    data: {
      name: "Pictures",
      parentId: root.id,
    },
  });

  // File contoh
  await prisma.file.create({
    data: {
      name: "example.txt",
      folderId: sub1.id,
      size: 1024,
      mime: "text/plain",
    },
  });

  await prisma.file.create({
    data: {
      name: "image.png",
      folderId: sub2.id,
      size: 2048,
      mime: "image/png",
    },
  });

  console.log("Seed completed.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
