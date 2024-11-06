import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
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
        <div className="flex flex-col inline">
          <button
            onClick={openProjectsList}
            className="p-1 text-dark1 rounded bg-secondary1 hover:bg-secondary2 focus:primary1"
            id="svg"
          >
            SVG
          </button>
          <div
            id="projectList"
            className="overflow-scroll flex flex-col z-10 bg-medium1 border-r-2 border-sate-300 h-full"
          >
            <Link to="new" className="text-sm text-secondary1 mx-2">
              <Button
                variant="outline"
                type="submit"
                className="shadow-lg size-xs"
              >
                + New Project
              </Button>
            </Link>
            <ol className="h-full flex-col text-secondary1 flex mx-2">
              {data.projectListItems.map((project) => (
                <li key={project.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `p-1 flex ${isActive ? "bg-secondary1 text-dark1 rounded" : ""}`
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
