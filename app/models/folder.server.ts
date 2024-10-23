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