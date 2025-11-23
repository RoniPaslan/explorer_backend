import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import {
  createFolder,
  createFile,
  getAllFolders,
  getSubfolders,
  getFolderFiles,
  renameFolder,
  renameFile,
  deleteFolder,
  deleteFile,
  getAllFiles,
} from "./services/folderService";
import { serializeBigInt } from "./utils/serialize";

const PORT = Number(process.env.PORT || 7001);

// Helper untuk build tree dan serialize BigInt
const buildFolderTree = (folders: any[], parentId: bigint | null = null): any[] => {
  return folders
    .filter(f => f.parentId === parentId)
    .map(f => serializeBigInt({
      ...f,
      children: buildFolderTree(folders, f.id),
    }));
};

// Helper serialize list subfolders/files
const serializeList = (list: any[]) =>
  list.map(item => serializeBigInt({
    ...item,
    id: item.id.toString(),
    parentId: item.parentId?.toString() || null,
    folderId: "folderId" in item ? item.folderId.toString() : undefined,
  }));

const app = new Elysia()
  .use(cors({ origin: "*" }))

  /* ====================
     GET FOLDERS / FILES
  ==================== */
  // Sidebar: folder tree
  .get("/folders/tree", async () => {
    const folders = await getAllFolders();
    return buildFolderTree(folders);
  })

  // Panel kanan: subfolders + files + breadcrumb
  .get("/folders/:id", async ({ params }) => {
    const folderId = BigInt(params.id);

    const subfoldersRaw = await getSubfolders(folderId);
    const filesRaw = await getFolderFiles(folderId);

    const subfolders = serializeList(subfoldersRaw);
    const files = serializeList(filesRaw);

    // Breadcrumb
    const folders = await getAllFolders();
    const breadcrumb: { id: string; name: string }[] = [];

    let current = folders.find(f => f.id === folderId) ?? null;
    while (current) {
      breadcrumb.unshift({
        id: current.id.toString(),
        name: current.name,
      });
      current = current.parentId !== null
        ? folders.find(f => f.id === current!.parentId) ?? null
        : null;
    }

    return { folders: subfolders, files, breadcrumb };
  });

/* ====================
   CREATE / UPDATE OPERATIONS
==================== */
// Tambah folder
app.post("/folders", async ({ body }) => {
  const { name, parentId } = body as { name: string; parentId: string | null };
  if (!name) return { error: "Folder name is required" };

  const folder = await createFolder(name, parentId ? BigInt(parentId) : null);
  return serializeBigInt(folder);
});

// Tambah file
app.post("/files", async (ctx) => {
  const formData = await ctx.request.formData();
  const folderId = BigInt(formData.get("folderId") as string);
  const file = formData.get("file") as File;

  if (!file) return { error: "File tidak ditemukan" };

  const newFile = await createFile(
    folderId,
    file.name,
    BigInt(file.size),
    file.type
  );
  return serializeBigInt(newFile);
});

// Rename folder
app.put("/folders/:id/rename", async ({ params, body }) => {
  const folderId = BigInt(params.id);
  const { name } = body as { name: string };
  if (!name) return { error: "Nama baru diperlukan" };

  const updated = await renameFolder(folderId, name);
  return serializeBigInt(updated);
});

// Rename file
app.put("/files/:id/rename", async ({ params, body }) => {
  const fileId = BigInt(params.id);
  const { name } = body as { name: string };
  if (!name) return { error: "Nama baru diperlukan" };

  const updated = await renameFile(fileId, name);
  return serializeBigInt(updated);
});

/* ====================
   DELETE OPERATIONS
==================== */
// Delete folder (rekursif)
/* DELETE OPERATIONS */

// Delete folder (rekursif)
app.delete("/folders/:id", async ({ params }) => {
  if (!params.id) return { error: "Folder ID tidak diberikan" };

  try {
    const folderId = BigInt(params.id);
    const deleted = await deleteFolder(folderId);
    return serializeBigInt(deleted);
  } catch (err) {
    return { error: "Gagal menghapus folder", details: (err as Error).message };
  }
});

// Delete file
app.delete("/files/:id", async ({ params }) => {
  if (!params.id) return { error: "File ID tidak diberikan" };

  try {
    const fileId = BigInt(params.id);
    const deleted = await deleteFile(fileId);
    return serializeBigInt(deleted);
  } catch (err) {
    return { error: "Gagal menghapus file", details: (err as Error).message };
  }
});

/* ====================
   SEARCH OPERATION
==================== */

app.get("/search", async ({ query }) => {
  const q = query.q?.toString().trim().toLowerCase() || "";
  if (!q) return { folders: [], files: [], breadcrumbMap: {} };

  // Ambil data lewat service (KONDISI WAJIB)
  const folders = await getAllFolders();
  const allFiles = await getAllFiles();

  // Filter folder
  const matchedFolders = folders.filter(f =>
    f.name.toLowerCase().includes(q)
  );

  // Filter file
  const matchedFiles = allFiles.filter(f =>
    f.name.toLowerCase().includes(q)
  );

  // Serialize
  const foldersSerialized = matchedFolders.map(f =>
    serializeBigInt({
      ...f,
      id: f.id.toString(),
      parentId: f.parentId?.toString() || null,
    })
  );

  const filesSerialized = matchedFiles.map(f =>
    serializeBigInt({
      ...f,
      id: f.id.toString(),
      folderId: f.folderId.toString(),
    })
  );

  // Breadcrumb builder
  const breadcrumbMap: Record<string, any[]> = {};

  const buildBreadcrumb = (folderId: bigint) => {
    const path: any[] = [];
    let current = folders.find(f => f.id === folderId) || null;

    while (current) {
      path.unshift({
        id: current.id.toString(),
        name: current.name,
      });
      current = current.parentId
        ? folders.find(f => f.id === current!.parentId) || null
        : null;
    }

    return path;
  };

  // Breadcrumb untuk folder hasil search
  foldersSerialized.forEach(f => {
    breadcrumbMap[`folder_${f.id}`] = buildBreadcrumb(BigInt(f.id));
  });

  // Breadcrumb untuk file hasil search
  filesSerialized.forEach(f => {
    breadcrumbMap[`file_${f.id}`] = buildBreadcrumb(BigInt(f.folderId));
  });

  return {
    folders: foldersSerialized,
    files: filesSerialized,
    breadcrumbMap,
  };
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
