import type { User, Project, Folder } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Project } from "@prisma/client";

// Get a specific project by id and userId
export function getProject({
  id,
  userId,
}: Pick<Project, "id"> & {
  userId: User["id"];
}) {
  return prisma.project.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  });
}

// Get list of projects for a specific userId
export function getProjectListItems({ userId }: { userId: User["id"] }) {
  return prisma.project.findMany({
    where: { userId },
    select: { id: true, title: true, body: true, folders: true },  // Assuming 'folders' is a relation field
    orderBy: { updatedAt: "desc" },
  });
}

// Create a new project, optionally associating it with a folder
export function createProject({
  body,
  title,
  userId,
  folderId,  // Optional folderId
}: Pick<Project, "body" | "title"> & {
  userId: User["id"];
  folderId?: Folder["id"];  // Optional parameter
}) {
  return prisma.project.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
      ...(folderId && {
        folders: {  // Assuming a one-to-many relationship with folders
          connect: { id: folderId },
        },
      }),
    },
  });
}

// Update an existing project, optionally updating the associated folder
export function updateProject({
  id,
  body,
  title,
  userId,
  folderId,  // Optional folderId
}: Pick<Project, "id" | "body" | "title"> & {
  userId: User["id"];
  folderId?: Folder["id"];  // Optional parameter
}) {
  return prisma.project.update({
    where: { id, userId },
    data: {
      title,
      body,
      ...(folderId && {
        folders: {  // Assuming a one-to-many relationship with folders
          connect: { id: folderId },
        },
      }),
    },
  });
}

// Delete a project by id and userId
export function deleteProject({
  id,
  userId,
}: Pick<Project, "id"> & { userId: User["id"] }) {
  return prisma.project.deleteMany({
    where: { id, userId },
  });
}
