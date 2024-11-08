import { Form, Link, NavLink, useLocation } from "@remix-run/react";

import { Button } from "./button";

// eslint-disable-next-line react/prop-types
export function HeaderGlobal({ drawerData }) {
  const location = useLocation();

  function openDrawer() {
    const projectListElement = document.getElementById("drawerContent");
    if (projectListElement) {
      projectListElement.classList.toggle("hidden");
    }
  }

  const getDrawerContent = () => {
    const path = location.pathname;

    if (path === "/dashboard/home") {
      return <HomeDrawerContent />;
    } else if (path.startsWith("/dashboard/library")) {
      return <LibraryDrawerContent data={drawerData} />;
    } else if (path === "/dashboard/community") {
      return <CommunityDrawerContent />;
    } else {
      return <DefaultDrawerContent />;
    }
  };

  return (
    <>
      <header className="flex justify-between p-2 text-white bg-dark1 border-b border-b-secondary2">
        <button
          onClick={openDrawer}
          className="p-1 text-dark1 rounded bg-secondary2 hover:bg-secondary1 focus:primary1"
          id="svg"
        >
          III
        </button>
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
      <div id="drawerContent" className="flex">
        <div className=" z-20 shadow-2xl flex absolute flex-col bg-dark2 border-r border-secondary2 h-full">
          {getDrawerContent()}
        </div>
      </div>
    </>
  );
}

function HomeDrawerContent() {
  return <div>Home-specific drawer content</div>;
}

function LibraryDrawerContent({ data }) {
  return (
    <div>
      <ol className="mt-1 mx-2 space-y-1 h-full flex-col text-secondary1 overflow-scroll">
        <Link to="/dashboard/library/new" className="text-sm text-secondary1">
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
              to={`/dashboard/library/${project.id}`}
            >
              {project.title}
              {/*<p>{project.body}</p>*/}
            </NavLink>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CommunityDrawerContent() {
  return <div>Community-specific drawer content</div>;
}

function DefaultDrawerContent() {
  return <div>Default drawer content</div>;
}
