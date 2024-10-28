import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/components/ui/button";
import { getFolderList } from "~/models/folder.server";
import { deleteProject, getProject } from "~/models/project.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  // Ensure that projectId and folderId are both defined
  invariant(params.projectId, "projectId not found");
  invariant(params.folderId, "folderId not found");

  const project = await getProject({ id: params.projectId, userId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  // Now params.folderId is guaranteed to be a string
  const folderList = await getFolderList({
    projectId: params.projectId,
  });

  return json({ project, folderList });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.projectId, "noteId not found");

  await deleteProject({ id: params.projectId, userId });

  return redirect("/dashboard/library");
};

export default function ProjectDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.project.title}</h3>
      <p className="py-4">{data.project.body}</p>
      <Link to="new" className="block p-4 text-xl text-black">
        <Button variant="outline" type="submit" className="shadow-xl size-sm">
          + New Folder
        </Button>
      </Link>
      <ol className="mx-4 text-slate-500">
        {data.folderList.map((folder) => (
          <li key={folder.id}>
            <NavLink
              className={({ isActive }) =>
                `block p-2 ${isActive ? "bg-slate-700 text-white rounded" : ""}`
              }
              to={`${folder.id}`}
            >
              {folder.title}
              {/*<p>{project.body}</p>*/}
            </NavLink>
          </li>
        ))}
      </ol>
      <Form method="post">
        <button
          type="submit"
          className="px-4 py-2 text-white rounded bg-slate-700 hover:bg-slate-400 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
      <Outlet />
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
