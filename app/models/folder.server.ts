import type { Project, Folder } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Folder } from "@prisma/client";

export function getFolder({
    id,
    projectId,
}: Pick<Folder, "id"> & {
    projectId: Project["id"];
}) {
    return prisma.folder.findFirst({
        select: { id: true, body: true, title: true },
        where: { id, projectId }
    });
}

export function getFolderFiles({ projectId }: { projectId: Project["id"] }) {
    return prisma.folder.findMany({
        where: { projectId },
        select: { id: true, title: true, body: true},
        orderBy: { updatedAt: "desc" },
    });
}

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

export function deleteFolder({
    id,
    projectId,
}: Pick<Folder, "id"> & { projectId: Project["id"]}) {
    return prisma.folder.deleteMany({
        where: { id, projectId },
    })
}