import { Elysia } from "elysia";
import { getAllFolders, getSubfolders } from "../services/folderService";

export const folderRoutes = new Elysia()
  .get("/folders", async () => await getAllFolders())
  .get("/folders/:id/subfolders", async ({ params }) => {
    const folderId = BigInt(params.id);
    return await getSubfolders(folderId);
  });
