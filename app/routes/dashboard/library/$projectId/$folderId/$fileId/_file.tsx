import { DownloadIcon } from "@radix-ui/react-icons";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import AudioWaveform from "~/components/AudioWaveform";
import { getFile, getFileList } from "~/models/file.server";
import { getFolder, listBucket } from "~/models/folder.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const folder = await getFolder({
    id: params.folderId as string,
    projectId: params.projectId as string,
  });
  if (!folder) {
    throw new Response("Not Found", { status: 404 });
  }
  const objects = await listBucket(folder.id);
  objects?.forEach((object) => {
    object.Key;
    object.Size;
  });

  const files = await getFileList({ folderId: params.folderId as string });
  const fileId = await getFile({
    id: params.fileId as string,
    folderId: params.folderId as string,
  });

  return json({ folder, fileId, files });
};

export default function File() {
  const data = useLoaderData<typeof loader>();

  return (
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
        </li>
      ))}
    </ol>
  );
}
