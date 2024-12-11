import { DownloadIcon } from "@radix-ui/react-icons";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
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
    <div className="w-full">
      <div className="flex gap-2">
        <h3>Selected File</h3>
        <a
          href={data.fileId?.remoteUrl}
          className="hover:text-primary2 text-primary1 size-10"
        >
          <div className="my-auto pt-1">
            <DownloadIcon />
          </div>
        </a>
      </div>
      <div className="flex flex-wrap gap-2 text-light2"></div>
      <AudioWaveform
        audioSrc={data.fileId?.remoteUrl}
        peaks={data.fileId?.peaks}
      />
    </div>
  );
}
