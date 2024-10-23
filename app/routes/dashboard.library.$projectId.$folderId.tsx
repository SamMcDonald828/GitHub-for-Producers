import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/components/ui/button";

import { deleteProject, getProject } from "~/models/project.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const projectId = await getProject({ id: params.projectId });

    const folder = await getFolder({ id: params.folderId, projectId});
    if (!folder) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ folder })
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
    invariant(params.projectId, "folderId not found");

    await deleteFolder({ id: params.folderId, projectId })

    return redirect("/dashboard/library");
}

