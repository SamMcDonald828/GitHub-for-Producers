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
import {
  deleteBucket,
  deleteFolder,
  getFolder,
  getFolderList,
} from "~/models/folder.server";
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
  } else if (_action === "deleteFolder") {
    // Fetch the folder before attempting to delete the bucket
    const folder = await getFolder({
      id: params.folderId as string,
      projectId: params.projectId,
    });

    // Ensure `folder` exists before calling `deleteBucket`
    if (folder) {
      await deleteBucket(folder.id);
      await deleteFolder({
        id: params.folderId as string,
        projectId: params.projectId,
      });
    } else {
      throw new Response("Folder Not Found", { status: 404 });
    }

    return redirect(`/dashboard/library/${params.projectId}`);
  }

  return redirect("/dashboard/library");
};

export default function ProjectDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <Form method="post" className="bg-slate-100 w-full p-2">
        <div className="flex justify-between mx-2">
          <input
            type="text"
            name="title"
            defaultValue={data.project.title || ""}
            className="border rounded p-1"
          />
          {/* <input
            type="text"
            name="body"
            defaultValue={data.project.body || ""}
            className="border rounded w-full p-2"
          /> */}
          <div className="flex inline gap-2">
            <button
              type="submit"
              name="_action"
              value="update"
              className="flex p-1 text-white rounded bg-slate-700 hover:bg-blue-400 focus:bg-blue-400"
            >
              update
            </button>
            <button
              type="submit"
              name="_action"
              value="delete"
              className="flex p-1 text-white rounded bg-red-700 hover:bg-red-400 focus:bg-red-400"
            >
              delete
            </button>
          </div>
        </div>
      </Form>
      <div className="bg-slate-200 flex flex-col">
        <div className="flex inline justify-between">
          <h2 className="text-xl text-slate-500">Folders(branches)</h2>
          <Link to="newFolder" className="flex block text-m text-black">
            <button className="shadow-xl border p-1 bg-white border-black hover:bg-slate-200">
              + New Folder
            </button>
          </Link>
        </div>
        <div className="flex flex-col">
          <ol className="text-slate-500 text-sm h-22 overflow-scroll rounded bg-slate-200">
            {data.folderList.map((folder) => (
              <li key={folder.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block p-1 ${isActive ? "bg-slate-700 text-white rounded" : ""}`
                  }
                  to={`${folder.id}`}
                >
                  {folder.title}{" "}
                  <button name="_action" value="deleteFolder">
                    {" "}
                    delete{" "}
                  </button>
                </NavLink>
                {/* delete folder function */}
              </li>
            ))}
          </ol>
          <div className="divider h-[2px] rounded bg-black w-full"></div>
          <Outlet />
        </div>
      </div>
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
