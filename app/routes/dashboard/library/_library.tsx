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
  return (
    <>
      <main className="flex h-full bg-white">
        <div className="overflow-scroll border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-black">
            <Button
              variant="outline"
              type="submit"
              className="shadow-xl size-sm"
            >
              + New Project
            </Button>
          </Link>
          <ol className="h-full mx-4 text-slate-500">
            {data.projectListItems.map((project) => (
              <li key={project.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block p-2 ${isActive ? "bg-slate-700 text-white rounded" : ""}`
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
        <div className="mx-4">
          <Outlet />
        </div>
      </main>
    </>
  );
}
