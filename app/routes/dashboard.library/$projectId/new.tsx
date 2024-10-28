import { Form } from "@remix-run/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { createFolder } from "~/models/folder.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";

export const action = async ({ params, request }: ActionFunctionArgs) => {
    // Extract projectId from params (not from the user session)
  
    const formData = await request.formData();
    const title = formData.get("title");

    if (typeof title !== "string" || !title) {
        throw new Response("Invalid title", { status: 400 });
      }
    // Create a new folder for the specified projectId
    const folder = await createFolder({ title, projectId: params.projectId });
  
    // Redirect to the created folder's page
    return redirect(`/dashboard/library/${params.projectId}`);
  };

export default function NewFolderPage() {
  console.log("new folder page rendered");
  const actionData = useActionData<typeof action>();
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
