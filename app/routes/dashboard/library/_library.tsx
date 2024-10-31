import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { Button } from "~/components/components/ui/button";
import { getProjectListItems } from "~/models/project.server";

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
      <main className="flex h-full bg-white">
        <div className="flex flex-col inline">
          <button
            onClick={openProjectsList}
            className="p-1 text-white rounded bg-blue-400 hover:bg-blue-500 focus:bg-blue-500"
            id="svg"
          >
            SVG
          </button>
          <div
            id="projectList"
            className="overflow-scroll flex flex-col z-10 bg-slate-200 h-full"
          >
            <Link to="new" className="text-sm text-black mx-2">
              <Button
                variant="outline"
                type="submit"
                className="shadow-lg size-xs"
              >
                + New Project
              </Button>
            </Link>
            <ol className="h-full flex-col text-slate-500 flex mx-2">
              {data.projectListItems.map((project) => (
                <li key={project.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `p-1 flex ${isActive ? "bg-slate-700 text-white rounded" : ""}`
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
