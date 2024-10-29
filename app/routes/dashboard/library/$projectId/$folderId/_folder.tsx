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
import { unstable_parseMultipartFormData } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Button } from "~/components/components/ui/button";
import { getFolder, deleteFolder } from "~/models/folder.server";
import { requireUserId } from "~/session.server";
import { s3UploadHandler, uploadStreamToS3 } from "~/utils/s3.server";
import { k } from "vite/dist/node/types.d-aGj9QkWt";
import { createFile } from "~/models/file.server";

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

  const file = await createFile({
    id: params.fileId as string,
    folderId: params.folderId as string,
    title: "", // Add a default value for title
    remoteUrl: "", // Add a default value for remoteUrl
  });
  // const folder = await getFolder();
  const key = file.id;
  const bucket = params.folderId;
  // const key = "123";
  // const bucket = "spring-tree-3095";

  const formData = await unstable_parseMultipartFormData(request, (args) =>
    s3UploadHandler({ key, bucket, ...args }),
  );

  const fileKey = formData.get("file");
  const fileName = formData.get("filename");
  const fileBucket = formData.get("bucket");
  // const fileUrl = `https://spring-tree-3095.fly.storage.tigris.dev/${fileBucket}/${fileKey}`;

  invariant(params.folderId, "folderId not found");
  invariant(params.projectId, "projectId not found");

  return redirect(`/dashboard/library/${params.projectId}`);
};

export default function FolderDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3>{data.folder.title}</h3>
      <Form method="post" encType="multipart/form-data">
        Upload a file
        <input name="file" type="file" accept="audio/*" />
        <input name="filename" type="text" placeholder="File Name" />
        <button type="submit">save</button>
      </Form>
    </div>
  );
}
