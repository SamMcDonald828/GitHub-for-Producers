import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  UploadHandler,
} from "@remix-run/node";
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
import { prisma } from "~/db.server";

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
    id: params.fileId || " ",
    folderId: params.folderId || "",
    title: "", // Add a default value for title
    remoteUrl: "", // Add a default value for remoteUrl
  });
  // const folder = await getFolder();
  // const key = "123";

  const s3UploadHandler: UploadHandler = async ({ filename, data }) => {
    const key = file.id;
    const bucket = "spring-tree-3095";
    // const bucket = params.folderId;

    const fileKey = await uploadStreamToS3(data, filename!, key, bucket);
    return fileKey;
  };

  const formData = await unstable_parseMultipartFormData(
    request,
    s3UploadHandler,
  );

  const fileKey = formData.get("file");
  //const fileName = formData.get("filename");
  // const updatedFile = await prisma.file.update({
  //   where: { id: file.id, folderId: params.folderId },
  //   data: {
  //     title: fileName as string,
  //     remoteUrl: `https://spring-tree-3095.fly.storage.tigris.dev/${params.folderId}/${file.id}`,
  //   },
  // });
  // const fileUrl = `https://spring-tree-3095.fly.storage.tigris.dev/${fileBucket}/${fileKey}`;

  invariant(params.folderId, "folderId not found");
  invariant(params.projectId, "projectId not found");

  return redirect(`/dashboard/library/${params.projectId}`);
};

export default function FolderDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col bg-slate-200 rounded">
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col space-y-4"
      >
        <div className="flex inline space-x-4">
          <h3 className="text-l my-auto font-semibold">{data.folder.title}</h3>
          <input name="file" type="file" accept="audio/*" />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          save file
        </button>
      </Form>
    </div>
  );
}
