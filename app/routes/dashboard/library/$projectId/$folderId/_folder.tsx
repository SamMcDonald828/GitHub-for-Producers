import { JsonValue } from "@prisma/client/runtime/library";
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
import { Form, Link, NavLink, useLoaderData, Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";
import WaveSurfer from "wavesurfer.js";

import DownloadIcon from "~/Icons/DownloadIcon";
import {
  createFile,
  getFile,
  getFileList,
  updatedFile,
} from "~/models/file.server";
import {
  getFolder,
  deleteFolder,
  listBucket,
  deleteBucket,
} from "~/models/folder.server";
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
    peaks: [], // Add a default value for peaks
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

  const generatePeaks = async (fileUrl: string): Promise<number[]> => {
    return new Promise((resolve) => {
      const waveSurfer = WaveSurfer.create({
        container: "", // Hidden container
        backend: "MediaElement",
      });

      waveSurfer.load(fileUrl);

      waveSurfer.on("ready", () => {
        const peaks = waveSurfer.backend.getPeaks(512); // Adjust resolution
        resolve(peaks);
        waveSurfer.destroy();
      });
    });
  };
  // Update peaks right there
  const peaks = await generatePeaks(fileUrl);

  await updatedFile({
    id: file.id,
    folderId: params.folderId as string,
    title: title as string,
    remoteUrl: fileUrl as string,
    peaks: peaks as JsonValue,
  });

  invariant(params.folderId, "folderId not found");
  invariant(params.projectId, "projectId not found");

  return redirect(`/dashboard/library/${params.projectId}/${params.folderId}`);
};

export default function FolderDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full bg-dark2 rounded shadow-xl text-white object-fit">
      <Form
        method="post"
        // action="/dashboard/library/:projectId/:folderId/delete"
        encType="multipart/form-data"
        className="flex justify-between"
      >
        <h3 className="text-l my-auto font-semibold">{data.folder.title}</h3>
        <button
          type="submit"
          name="_action"
          value="deleteFolder"
          className="p-1 m-auto text-primary1 rounded border border-primary1 hover:bg-primary2 hover:text-white focus:bg-red-400"
        >
          delete Folder
        </button>
      </Form>
      <Form method="post" encType="multipart/form-data" className="m-2">
        <div className="flex flex-col space-y-2">
          {/* create editing state <input
            type="text"
            name="title"
            defaultValue={data.folder.title}
            className="border rounded p-1" /> */}
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
        {data.files.map((file) => (
          <li key={file.id} className="max-w-96">
            <NavLink
              className={({ isActive }) =>
                `flex p-1 ${isActive ? "bg-medium2 text-accent1" : ""}`
              }
              to={`${file.id}`}
            >
              <div className="flex gap-2 text-light2">
                <p>{file.title}</p>
                <a
                  href={file.remoteUrl}
                  className="hover:text-primary2 text-primary1"
                >
                  <DownloadIcon />
                </a>
              </div>
            </NavLink>
          </li>
        ))}
      </ol>
      <Outlet />
      {/* <AudioFile fileId={fileId}/> */}
      {/* Create a file component that shows the waveform and takes in a selected fileId, fileTitle, remoteURL */}
    </div>
  );
}
