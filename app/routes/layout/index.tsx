import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { HeaderGlobal } from "~/components/components/ui/HeaderGlobal";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  return json({});
};

export default function LayoutIndexPage() {
  return (
    <>
      <HeaderGlobal />
      <p>
        No note selected. Select a note on the left, or{" "}
        <Link to="new" className="text-blue-500 underline">
          create a new note.
        </Link>
      </p>
      <Outlet />
    </>
  );
}
