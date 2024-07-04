import { Link, NavLink, Outlet } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  return json({});
};
export default function LibraryPage() {
  return (
    <>
      <main className="flex h-full bg-white">
        <div className="w-48 h-full border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
        <p>
          No note selected. Select a note on the left, or{" "}
          <Link to="/new" className="text-blue-500 underline">
            create a new note.
          </Link>
        </p>
      </main>
    </>
  );
}
