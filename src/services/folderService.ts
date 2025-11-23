import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllFolders = async () => {
  return prisma.folder.findMany({
    include: { children: true, files: true },
  });
};

export const getSubfolders = async (folderId: bigint) => {
  return prisma.folder.findMany({
    where: { parentId: folderId },
    include: { files: true },
  });
};

export const getFolderFiles = async (folderId: bigint) => {
  return prisma.file.findMany({
    where: { folderId },
  });
};

// Create folder
export const createFolder = async (name: string, parentId: bigint | null) => {
  return prisma.folder.create({
    data: {
      name,
      parentId,
    },
  });
};

// Create file
export const createFile = async (
  folderId: bigint,
  name: string,
  size: bigint,
  mime: string | null
) => {
  return prisma.file.create({
    data: { folderId, name, size, mime },
  });
};

// Rename folder
export const renameFolder = async (id: bigint, name: string) => {
  return prisma.folder.update({ where: { id }, data: { name } });
};

// Rename file
export const renameFile = async (id: bigint, name: string) => {
  return prisma.file.update({ where: { id }, data: { name } });
};

// Delete folder (berserta children & files jika ada)
export const deleteFolder = async (id: bigint) => {
  // Hapus semua subfolder dan file secara rekursif
  const subfolders = await prisma.folder.findMany({ where: { parentId: id } });
  for (const sub of subfolders) {
    await deleteFolder(sub.id);
  }

  await prisma.file.deleteMany({ where: { folderId: id } });
  return prisma.folder.delete({ where: { id } });
};

// Delete file
export const deleteFile = async (id: bigint) => {
  return prisma.file.delete({ where: { id } });
};

export const getAllFiles = async () => {
  return prisma.file.findMany();
};

