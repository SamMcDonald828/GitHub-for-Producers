import { Form, Link, NavLink, useLocation } from "@remix-run/react";

import CommunityIcon from "~/Icons/CommunityIcon";
import DrawerIcon from "~/Icons/DrawerIcon";
import HomeIcon from "~/Icons/HomeIcon";
import LibraryIcon from "~/Icons/LibraryIcon";

import { Button } from "./button";

// eslint-disable-next-line react/prop-types
export function HeaderGlobal({ drawerData }) {
  const location = useLocation();

  function openDrawer() {
    const drawer = document.getElementById("drawerContent");
    if (drawer) {
      drawer.classList.toggle("hidden");
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
      <header className="flex justify-between p-2 text-primary1 bg-dark1 border-b border-b-secondary2">
        <button
          onClick={openDrawer}
          className=" rounded text-primary1 hover:text-secondary1"
          id="svg"
        >
          <DrawerIcon />
        </button>
        <div className="flex justify-center gap-4 font-normal mx-auto">
          <h3 className="font-semibold">
            <NavLink
              to="home"
              className={({ isActive }) =>
                isActive
                  ? " text-primary1 stroke-primary2 drop-shadow-glow"
                  : "opacity-60 hover:text-primary2"
              }
            >
              <HomeIcon />
            </NavLink>
          </h3>
          <h3 className="font-semibold">
            <NavLink
              to="library"
              className={({ isActive }) =>
                isActive
                  ? "text-primary1 stroke-primary2 drop-shadow-glow"
                  : "opacity-60 hover:text-primary2"
              }
            >
              <LibraryIcon />
            </NavLink>
          </h3>
          <h3 className="font-semibold">
            <NavLink
              to="community"
              className={({ isActive }) =>
                isActive
                  ? " text-primary1 stroke-primary2 drop-shadow-glow"
                  : "opacity-60 hover:text-primary2"
              }
            >
              <CommunityIcon />
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
