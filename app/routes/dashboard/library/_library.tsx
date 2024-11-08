import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/components/ui/button";
import { getProjectListItems } from "~/models/project.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const projectListItems = await getProjectListItems({ userId });
  return json({ projectListItems });
};
export default function LibraryPage() {
  const data = useLoaderData<typeof loader>();
  function openProjectsList() {
    const projectListElement = document.getElementById("projectList");
    if (projectListElement) {
      projectListElement.classList.toggle("hidden");
    }
  }

  return (
    <>
      <main className="flex h-full bg-dark1">
        <Outlet />
      </main>
    </>
  );
}
