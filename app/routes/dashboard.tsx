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

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div>
      {/**This is the navbar */}
      <HeaderGlobal />
      {/**This is the main window for the notes future=>homepage */}
      <Outlet />
    </div>
  );
}
