import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { Button } from "~/components/components/ui/button";
import ProjectDetailsPage from "./dashboard.library.$projectId";
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
        <div className="w-48 h-full border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            <Button type="submit">+ New Project</Button>
          </Link>
          {data.projectListItems.map((project) => (
            <ol key={project.id}>
              <li>
                <NavLink to={`${project.id}`}>
                  <h1>{project.title}</h1>
                  <p>{project.body}</p>
                </NavLink>
              </li>
            </ol>
          ))}
        </div>
        <Outlet />
      </main>
    </>
  );
}
