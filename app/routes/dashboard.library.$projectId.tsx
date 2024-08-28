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

import {
  deleteProject,
  getProject,
  updateProject,
} from "~/models/project.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.projectId, "noteId not found");

  const project = await getProject({ id: params.projectId, userId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ project });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.projectId, "noteId not found");
  const formData = await request.formData();
  if (request.method === "delete") {
    await deleteProject({ id: params.projectId, userId });

    return redirect("/dashboard/library");
  } else if (request.method === "put") {
    await updateProject({ id: params.projectId, userId });

    return redirect(`/dashboard/library/$projectId`);
  }
};

export default function ProjectDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.project.title}</h3>
      <p className="py-4">{data.project.body}</p>
      <Form method="post">
        <button
          type="submit"
          className="px-4 py-2 text-white rounded bg-slate-700 hover:bg-slate-400 focus:bg-blue-400"
        >
          Delete
        </button>
        <button type="submit" formMethod="put">
          Update
        </button>
        <Outlet />
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
