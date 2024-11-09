import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  UploadHandler,
} from "@remix-run/node";
import {
  json,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  useLoaderData,
  useRouteError,
  Outlet,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import AudioWaveform from "~/components/AudioWaveform";
import DownloadIcon from "~/Icons/DownloadIcon";
import {
  createFile,
  getFile,
  getFileList,
  updatedFile,
} from "~/models/file.server";
import { getFolder, deleteFolder, listBucket } from "~/models/folder.server";
import { requireUserId } from "~/session.server";
import { s3UploadHandler, uploadStreamToS3 } from "~/utils/s3.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const files = await getFileList({ folderId: params.folderId as string });
  const fileId = await getFile({
    id: params.fileId as string,
    folderId: params.folderId as string,
  });

  invariant(params.folderId, "folderId not found");
  invariant(params.projectId, "projectId not found");

  const folder = await getFolder({
    id: params.folderId,
    projectId: params.projectId,
  });
  if (!folder) {
    throw new Response("Not Found", { status: 404 });
  }
  const objects = await listBucket(folder.id);
  objects?.forEach((object) => {
    object.Key;
    object.Size;
  });
  return json({ folder, fileId, files, objects });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireUserId(request);
  const folder = await getFolder({
    id: params.folderId as string,
    projectId: params.projectId as string,
  });

  const file = await createFile({
    // automatically generate a unique id for the file
    folderId: params.folderId || "",
    title: "", // Add a default value for title
    remoteUrl: "", // Add a default value for remoteUrl
  });

  let title = "" as string;
  const s3UploadHandler: UploadHandler = async ({ filename, data }) => {
    const key = file.id;
    const bucket = folder!.id;
    title = filename as string;
    const fileKey = await uploadStreamToS3(data, filename!, key, bucket);
    return fileKey;
  };

  const fileData = await unstable_parseMultipartFormData(
    request,
    s3UploadHandler,
  );

  // Set file link after upload started
  const fileUrl = `https://fly.storage.tigris.dev/${folder!.id}/${file.id}`;
  // Update file name after upload started
  await updatedFile({
    id: file.id,
    folderId: params.folderId as string,
    title: title as string,
    remoteUrl: fileUrl as string,
  });

  invariant(params.folderId, "folderId not found");
  invariant(params.projectId, "projectId not found");

  return redirect(`/dashboard/library/${params.projectId}/${params.folderId}`);
};

export default function FolderDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full bg-dark2 rounded shadow-xl text-white object-fit">
      <Form method="post" encType="multipart/form-data" className="m-2">
        <div className="flex flex-col space-y-2">
          <h3 className="text-l my-auto font-semibold">{data.folder.title}</h3>
          <input name="file" type="file" accept="audio/*" required />
          <button
            type="submit"
            className="p-1 text-primary2 rounded border bg-dark1 hover:text-white border-primary2 hover:bg-primary2 max-w-28"
          >
            upload file(s)
          </button>
        </div>
      </Form>
      <ol className="w-full">
        <h3>Files</h3>
        {data.files.map((file) => (
          <li key={file.id} className="max-w-96">
            <div className="flex gap-2 text-light2">
              <p>{file.title}</p>
              <a
                href={file.remoteUrl}
                className="hover:text-primary2 text-primary1"
              >
                <DownloadIcon />
              </a>
            </div>
            <AudioWaveform audioSrc={file.remoteUrl} />
            {/* future  <Link
              to={`https://spring-tree-3095.fly.storage.tigris.dev/${data.folder.id}/${file.id}`}
            >
              <button type="submit">download</button>
            </Link> */}
          </li>
        ))}
      </ol>
      {/* <AudioFile fileId={fileId}/> */}
      {/* Create a file component that shows the waveform and takes in a selected fileId, fileTitle, remoteURL */}
    </div>
  );
}
