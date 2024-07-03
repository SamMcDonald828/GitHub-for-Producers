import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getNoteListItems } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
};

export default function HomePage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/**This is the navbar */}
      <header className="flex items-center justify-between p-4 text-white bg-slate-800">
        <h1 className="text-2xl font-bold active:underline">
          <NavLink
            to="."
            end
            className={({ isActive }) =>
              isActive ? "underline" : "opacity-60"
            }
          >
            Home
          </NavLink>
        </h1>
        <h1 className="text-2xl font-bold">
          <NavLink
            to="/home/library"
            end
            className={({ isActive }) =>
              isActive ? "underline" : "opacity-60"
            }
          >
            Library
          </NavLink>
        </h1>
        <h1 className="text-2xl font-bold">
          <NavLink
            to="/home/community"
            end
            className={({ isActive }) =>
              isActive ? "underline" : "opacity-60"
            }
          >
            Community
          </NavLink>
        </h1>
        {/*<p>{user.email}</p>*/}
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="px-4 py-2 text-blue-100 rounded bg-slate-600 hover:bg-white hover:text-black active:bg-slate-400"
          >
            Logout
          </button>
        </Form>
      </header>
      {/**This is the main window for the notes future=>homepage */}
      <main className="flex h-full bg-white">
        {/*
        <div className="h-full border-r w-80 bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
                  </div> */}

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
