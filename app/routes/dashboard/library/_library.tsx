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
        <div className="z-20 shadow-2xl flex absolute flex-col bg-dark2 border-r border-secondary2 h-full">
          <button
            onClick={openProjectsList}
            className="p-1 text-dark1 rounded bg-secondary2 hover:bg-secondary1 focus:primary1"
            id="svg"
          >
            III
          </button>
          <div id="projectList" className="mx-2 flex">
            <ol className="space-y-1 h-full flex-col text-secondary1 overflow-scroll">
              <Link to="new" className="text-sm text-secondary1">
                <Button variant="outline" type="submit" className="shadow-lg">
                  + New Project
                </Button>
              </Link>
              {data.projectListItems.map((project) => (
                <li key={project.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `p-1 flex ${isActive ? "bg-secondary2 shadow-l text-dark1 rounded" : ""}`
                    }
                    to={project.id}
                  >
                    {project.title}
                    {/*<p>{project.body}</p>*/}
                  </NavLink>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <Outlet />
      </main>
    </>
  );
}
