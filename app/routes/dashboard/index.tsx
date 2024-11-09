import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { HeaderGlobal } from "~/components/components/ui/HeaderGlobal";
import { getProjectListItems } from "~/models/project.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const projectListItems = await getProjectListItems({ userId });
  return json({ projectListItems });
};

export default function DashboardIndexPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <HeaderGlobal drawerData={data} />
      <div className="flex h-full bg-dark1">
        <Outlet />
      </div>
    </>
  );
}
