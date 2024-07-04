import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { HeaderGlobal } from "~/components/components/ui/HeaderGlobal";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  return json({});
};

export default function Layout() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/**This is the navbar */}
      <HeaderGlobal />
      {/**This is the main window for the notes future=>homepage */}
      <main className="flex h-full bg-white">
        <div className="h-full border-r w-80 bg-gray-50"></div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
