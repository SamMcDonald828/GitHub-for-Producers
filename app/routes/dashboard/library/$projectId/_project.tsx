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
import {
  deleteProject,
  getProject,
  updateProject,
} from "~/models/project.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  invariant(params.projectId, "projectId not found");

  const project = await getProject({ id: params.projectId, userId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  const folderList = await getFolderList({
    projectId: params.projectId,
  });

  return json({ project, folderList });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  let formData = await request.formData();
  let { _action, title, body } = Object.fromEntries(formData);

  invariant(params.projectId, "projectId not found");

  if (_action === "update") {
    await updateProject({
      id: params.projectId,
      userId,
      title: title?.toString() || "", // Ensure title and body are strings
      body: body?.toString() || "",
    });
    return redirect(`/dashboard/library/${params.projectId}`);
  } else if (_action === "delete") {
    await deleteProject({ id: params.projectId, userId });
  }

  return redirect("/dashboard/library");
};

export default function ProjectDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col">
      <Form method="post">
        <div className="py-4">
          <input
            type="text"
            name="title"
            defaultValue={data.project.title || ""}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="py-4">
          <textarea
            name="body"
            defaultValue={data.project.body || ""}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex inline">
          <button
            type="submit"
            name="_action"
            value="update"
            className="flex inline justify-center px-4 py-2 text-white rounded bg-slate-700 hover:bg-blue-400 focus:bg-blue-400"
          >
            Update
          </button>
          <button
            type="submit"
            name="_action"
            value="delete"
            className="px-4 py-2 text-white rounded bg-red-700 hover:bg-red-400 focus:bg-red-400"
          >
            Delete
          </button>
        </div>
      </Form>

      <Link to="newFolder" className="flex block text-xl text-black">
        <Button variant="outline" className="shadow-xl size-sm">
          + New Folder
        </Button>
      </Link>
      <ol className="text-slate-500">
        {data.folderList.map((folder) => (
          <li key={folder.id}>
            <NavLink
              className={({ isActive }) =>
                `block p-2 ${isActive ? "bg-slate-700 text-white rounded" : ""}`
              }
              to={`${folder.id}`}
            >
              {folder.title}
            </NavLink>
          </li>
        ))}
      </ol>
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
