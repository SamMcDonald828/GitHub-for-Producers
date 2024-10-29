import type { Folder, File } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Folder } from "@prisma/client";

export function getFile({
  id,
  folderId,
}: Pick<File, "id"> & {
  folderId: Folder["id"];
}) {
  return prisma.file.findFirst({
    select: { id: true, title: true, remoteUrl: true },
    where: { id, folderId },
  });
}

export function getFileList({ folderId }: { folderId: Folder["id"] }) {
  return prisma.file.findMany({
    where: { folderId },
    select: { id: true, title: true, remoteUrl: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createFile({
  id,
  title,
  remoteUrl,
  folderId,
}: Pick<File, "id" | "title" | "remoteUrl"> & { folderId: Folder["id"] }) {
  return prisma.file.create({
    data: {
      title,
      remoteUrl,
      folder: {
        connect: {
          id: folderId,
        },
      },
    },
  });
}

export function deleteFile({
  id,
  folderId,
}: Pick<File, "id"> & { folderId: Folder["id"] }) {
  return prisma.file.deleteMany({
    where: { id, folderId },
  });
}
