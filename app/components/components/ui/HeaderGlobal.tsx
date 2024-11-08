import { Form, Link, NavLink, useLocation } from "@remix-run/react";

import { Button } from "./button";

export function HeaderGlobal() {
  const location = useLocation();

  function openDrawer() {
    const projectListElement = document.getElementById("drawerContent");
    if (projectListElement) {
      projectListElement.classList.toggle("hidden");
    }
  }

  const getDrawerContent = () => {
    switch (location.pathname) {
      case "/home":
        return <HomeDrawerContent />;
      case "/library":
        return <LibraryDrawerContent />;
      case "/community":
        return <CommunityDrawerContent />;
      default:
        return <DefaultDrawerContent />;
    }
  };

  return (
    <header className="flex justify-between p-2 text-white bg-dark1 border-b border-b-secondary2">
      <button
        onClick={openDrawer}
        className="p-1 text-dark1 rounded bg-secondary2 hover:bg-secondary1 focus:primary1"
        id="svg"
      >
        III
      </button>
      <div id="drawerContent" className="mx-2 flex">
        <div className="z-20 shadow-2xl flex absolute flex-col bg-dark2 border-r border-secondary2 h-full">
          {getDrawerContent()}
        </div>
      </div>
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

function HomeDrawerContent() {
  return <div>Home-specific drawer content</div>;
}

function LibraryDrawerContent() {
  return (
    <div>
      <ol className="space-y-1 h-full flex-col text-secondary1 overflow-scroll">
        <Link to="new" className="text-sm text-secondary1">
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
              to={project.id}
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
