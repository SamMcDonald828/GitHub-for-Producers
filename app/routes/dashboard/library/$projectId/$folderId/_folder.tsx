import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  NavLink,
  useLoaderData,
  useRouteError,
  Outlet,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/components/ui/button";
import { getFolder, deleteFolder } from "~/models/folder.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  invariant(params.folderId, "folderId not found");
  invariant(params.projectId, "projectId not found");

  const folder = await getFolder({
    id: params.folderId,
    projectId: params.projectId,
  });
  if (!folder) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ folder });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireUserId(request);

  invariant(params.folderId, "folderId not found");
  invariant(params.projectId, "projectId not found");

  return redirect(`/dashboard/library/${params.projectId}`);
};

export default function FolderDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3>{data.folder.title}</h3>
      <Form method="post">
        Upload a file
        <input type="file" />
        <button type="submit">save</button>
      </Form>
      {data.folder.files.length > 0 ? (
        <ol>
          {data.folder.files.map((file) => (
            <li key={file.id}>
              <NavLink
                className={({ isActive }) =>
                  `block p-2 ${isActive ? "bg-slate-700 text-white rounded" : ""}`
                }
                to={file.id}
              >
                {file.title}
                {/*<p>{file.body}</p>*/}
                {/*<p>{file.comments}</p>*/}
                {/*Audio file display would go here later*/}
                {/*Delete/upload replacement/merge*/}
                {/*Or Entire File Component <AudioFile /> will be imported here*/}
              </NavLink>
            </li>
          ))}
        </ol>
      ) : (
        <p>No files in this folder</p>
      )}
    </div>
  );
}
