import type { Project, Folder } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Folder } from "@prisma/client";

// Function to get a specific folder by its id and related projectId
export function getFolder({
  id,
  projectId,
}: Pick<Folder, "id"> & {
  projectId: Project["id"];
}) {
  return prisma.folder.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, projectId },
  });
}

// Function to get all folder list items for a specific projectId
export function getFolderListItems({ projectId }: { projectId: Project["id"] }) {
  return prisma.folder.findMany({
    where: { projectId },
    select: { id: true, title: true, body: true },
    orderBy: { updatedAt: "desc" },
  });
}

// Function to create a new folder and associate it with a project
export function createFolder({
  body,
  title,
  projectId,
}: Pick<Folder, "body" | "title"> & {
  projectId: Project["id"];
}) {
  return prisma.folder.create({
    data: {
      title,
      body,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });
}

// Function to update an existing folder
export function updateFolder({
  id,
  body,
  title,
  projectId,
}: Pick<Folder, "id" | "body" | "title"> & {
  projectId: Project["id"];
}) {
  return prisma.folder.updateMany({
    where: { id, projectId },
    data: {
      title,
      body,
    },
  });
}

// Function to delete a folder by its id and associated projectId
export function deleteFolder({
  id,
  projectId,
}: Pick<Folder, "id"> & { projectId: Project["id"] }) {
  return prisma.folder.deleteMany({
    where: { id, projectId },
  });
}
