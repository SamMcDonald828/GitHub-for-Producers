import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteFolder, getFolder, updateFolder } from "~/models/folder.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.projectId, "noteId not found");

  const project = await getFolder({ id: params.folderId, userId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ project });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.folderId, "folderId not found");

  await deleteFolder({ id: params.folderId, userId });

  return redirect("/dashboard/library");
};
