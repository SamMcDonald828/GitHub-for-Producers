import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  return json({});
};
export default function Library() {
  <main className="flex h-full bg-white">
    <div className="h-full border-r w-80 bg-gray-50">
      <Link to="new" className="block p-4 text-xl text-blue-500">
        + New Note
      </Link>

      <hr />
    </div>

    <div className="flex-1 p-6">
      <Outlet />
    </div>
  </main>;
}
