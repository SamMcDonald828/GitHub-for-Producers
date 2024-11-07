import { Form, NavLink } from "@remix-run/react";

export function HeaderGlobal() {
  return (
    <header className="flex justify-between p-2 text-white bg-dark1 border-b border-b-secondary2">
      <div className="flex justify-center gap-4 font-normal mx-auto">
        <h3 className="font-semibold">
          <NavLink
            to="home"
            className={({ isActive }) =>
              isActive ? "underline text-light2 rounded" : "opacity-60"
            }
          >
            Home
          </NavLink>
        </h3>
        <h3 className=" font-semibold">
          <NavLink
            to="library"
            className={({ isActive }) =>
              isActive ? "underline text-light2 rounded" : "opacity-60"
            }
          >
            Library
          </NavLink>
        </h3>
        <h3 className="font-semibold">
          <NavLink
            to="community"
            className={({ isActive }) =>
              isActive ? "underline text-light2 rounded" : "opacity-60"
            }
          >
            Community
          </NavLink>
        </h3>
      </div>
      {/*<p>{user.email}</p>*/}
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="text-dark1 text-sm hover:bg-secondary2 bg-accent1 rounded p-[3px] font-semibold"
        >
          Logout
        </button>
      </Form>
    </header>
  );
}
