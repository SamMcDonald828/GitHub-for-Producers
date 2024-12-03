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
    select: { id: true, title: true, remoteUrl: true, peaks: true },
    where: { id, folderId },
  });
}

export function getFileList({ folderId }: { folderId: Folder["id"] }) {
  return prisma.file.findMany({
    where: { folderId },
    select: { id: true, title: true, remoteUrl: true, peaks: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createFile({
  title,
  remoteUrl,
  folderId,
  peaks,
}: Pick<File, "title" | "remoteUrl" | "peaks"> & { folderId: Folder["id"] }) {
  return prisma.file.create({
    data: {
      title,
      remoteUrl,
      peaks,
      folder: {
        connect: {
          id: folderId,
        },
      },
    },
  });
}

export function updatedFile({
  id,
  folderId,
  title,
  remoteUrl,
  peaks,
}: Pick<File, "id" | "title" | "remoteUrl" | "peaks"> & {
  folderId: Folder["id"];
}) {
  return prisma.file.update({
    where: { id, folderId },
    data: {
      title,
      remoteUrl,
      peaks,
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
