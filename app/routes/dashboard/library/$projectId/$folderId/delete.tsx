export default async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);
  // Ensure `folder` exists before calling `deleteBucket`

  const folder = await getFolder({
    id: params.folderId as string,
    projectId: params.projectId as string,
  });

  if (folder) {
    await deleteBucket(folder.id);
    await deleteFolder({
      id: params.folderId as string,
      projectId: params.projectId as string,
    });
  } else {
    throw new Response("Folder Not Found", { status: 404 });
  }
  return redirect(`/dashboard/library/${params.projectId}`);
  // upload action goes here
}