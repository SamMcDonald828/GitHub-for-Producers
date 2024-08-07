import { Form, NavLink } from "@remix-run/react";

export function HeaderGlobal() {
  return (
    <header className="flex justify-between p-4 text-white bg-black">
      <div className="flex justify-center gap-4 mx-auto">
        <h1 className="text-2xl font-bold active:underline">
          <NavLink
            to="home"
            className={({ isActive }) =>
              isActive ? "underline" : "opacity-60"
            }
          >
            Home
          </NavLink>
        </h1>
        <h1 className="text-2xl font-bold">
          <NavLink
            to="library"
            className={({ isActive }) =>
              isActive ? "underline" : "opacity-60"
            }
          >
            Library
          </NavLink>
        </h1>
        <h1 className="text-2xl font-bold">
          <NavLink
            to="community"
            className={({ isActive }) =>
              isActive ? "underline" : "opacity-60"
            }
          >
            Community
          </NavLink>
        </h1>
      </div>
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
  );
}
