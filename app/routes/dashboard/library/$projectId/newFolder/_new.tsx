import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { createBucket, createFolder } from "~/models/folder.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { useEffect, useRef } from "react";
import { Button } from "~/components/components/ui/button";
import { getProject } from "~/models/project.server";
import { Input } from "~/components/components/ui/input";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const projectId = await getProject({
    id: params.projectId as string,
    userId,
  }); // Ensure projectId is in params

  const formData = await request.formData();
  const title = formData.get("title");
  if (typeof title !== "string" || !title) {
    throw new Response("Invalid title", { status: 400 });
  }

  // Create a new folder and bucket for storage using the projectId from params
  const folder = await createFolder({
    title,
    projectId: params.projectId as string,
  });
  const bucket = await createBucket(folder.id);

  // Redirect to the created folder's page
  return redirect(`/dashboard/library/${params.projectId}/${folder.id}`);
};

export const loader = async () => {
  return json({ message: "New Folder route loaded successfully" });
};

export default function NewFolderPage() {
  console.log("new folder page rendered");
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h3 className="text-xl font-bold">Create a New Folder</h3>
      <Form method="post">
        <Input
          className="rounded"
          id="title"
          name="title"
          placeholder="Name of your Folder"
        />

        <Button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Folder
        </Button>
      </Form>
    </div>
  );
}
