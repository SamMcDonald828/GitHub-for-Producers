import {
  CreateBucketCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import type { Project, Folder } from "@prisma/client";
import { prisma } from "~/db.server";
import { s3 } from "~/utils/s3.server";

export type { Folder } from "@prisma/client";

export function getFolder({
  id,
  projectId,
}: Pick<Folder, "id"> & {
  projectId: Project["id"];
}) {
  return prisma.folder.findFirst({
    select: { id: true, title: true },
    where: { id, projectId },
  });
}

export function getFolderList({ projectId }: { projectId: Project["id"] }) {
  return prisma.folder.findMany({
    where: { projectId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createFolder({
  title,
  projectId,
}: Pick<Folder, "title"> & {
  projectId: Project["id"];
}) {
  return prisma.folder.create({
    data: {
      title,
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });
}

export function deleteFolder({
  id,
  projectId,
}: Pick<Folder, "id"> & { projectId: Project["id"] }) {
  return prisma.folder.deleteMany({
    where: { id, projectId },
  });
}

// _folder.tsx
/*

const bucket = await createBucket(project.id);
bucket.Key === project.id;

const objects = await listBucket(project.id);
objects.forEach((object) => {
  object.Key;
  object.Key === file.id;
  object.Location;
});

*/

export async function createBucket(id: string) {
  // make a directory
  const command = new CreateBucketCommand({
    Bucket: id,
    ACL: "public-read",
  });
  const response = await s3.send(command);
  return response;
}

export async function listBucket(id: string) {
  const command = new ListObjectsCommand({
    Bucket: id,
  });
  const response = await s3.send(command);
  return response.Contents;
}
