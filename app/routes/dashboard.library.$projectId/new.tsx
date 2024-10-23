import { Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { createFolder } from "~/models/folder.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";

export const action = async ({ params, request }) => {
  const projectId = await requireUserId(request);

  // Ensure the projectId is provided
  invariant(params.projectId, "projectId not found");

  const formData = await request.formData();
  const title = formData.get("title");

  // Create a new folder for this project
  const folder = await createFolder({ title, projectId });

  return redirect(`/dashboard/library/${folder.id}`);
};

export default function NewFolderPage() {
  return (
    <div>
      <h3 className="text-xl font-bold">Create a New Folder</h3>
      <Form method="post">
        <label htmlFor="title" className="block text-lg">Folder Title</label>
        <input id="title" name="title" className="border p-2 mt-2 w-full" required />

        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Create Folder
        </button>
      </Form>
    </div>
  );
}
