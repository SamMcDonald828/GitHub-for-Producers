import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { getProjectListItems } from "~/models/project.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const projectListItems = await getProjectListItems({ userId });
  return json({ projectListItems });
};
export default function LibraryPage() {
  return (
    <>
      <main className="flex h-full bg-dark1">
        <Outlet />
      </main>
    </>
  );
}
