import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  NavLink,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/components/ui/button";
import { getFolder, deleteFolder, createFolder, getFolderListItems } from "~/models/folder.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const userId = await requireUserId(request);

    const folder = await getFolder({ id: params.folderId, projectId: params.projectId });
    if (!folder) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ folder })
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const projectId = await requireUserId(request);
    invariant(params.projectId, "folderId not found");

    await deleteFolder({ id: params.folderId, projectId: params.projectId })

    return redirect(`/dashboard/library/${params.projectId}`);
}

export default function FolderDetailsPage() {
    const data = useLoaderData<typeof loader>();

    return (
       <div>
        <h3>{data.folder.title}</h3>
        <Form method="post">
            <input type="file">Upload a file/files</input>
            <button type="submit">save</button>
        </Form>
        <ol>
        {data.folderFiles.map((file) => (
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
       </div> 

    );
}