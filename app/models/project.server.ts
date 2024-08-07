import type { User, Project, Folder } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Project } from "@prisma/client";

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

export function getProjectListItems({ userId }: { userId: User["id"] }) {
  return prisma.project.findMany({
    where: { userId },
    select: { id: true, title: true, body: true},
    orderBy: { updatedAt: "desc" },
  });
}

export function createProject({
  body,
  title,
  folder,
  userId,
}: Pick<Project, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.project.create({
    data: {
      title,
      body,
      folder: {
        connect: {
          id: folderId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateProject({
  body,
  title,
  folder,
  folderId,
  userId,
}: Pick<Project, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.project.create({
    data: {
      title,
      body,
      folder: {
        connect: {
          id: folderId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteProject({
  id,
  userId,
}: Pick<Project, "id"> & { userId: User["id"] }) {
  return prisma.project.deleteMany({
    where: { id, userId },
  });
}