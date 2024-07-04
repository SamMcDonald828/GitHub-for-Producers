import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { WavyBackground } from "~/components/components/ui/wavy-background";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="">
      <WavyBackground className="max-w-4xl pb-40 mx-auto">
        <h1 className="text-6xl font-extrabold tracking-tight text-center sm:text-8xl lg:text-9xl mt-28">
          <span className="text-white uppercase drop-shadow-md">
            Producers Space
          </span>
        </h1>
        <p className="mt-6 text-2xl font-normal text-center text-white md:text-4xl inter-var">
          The GitHub for Music Producers
        </p>
        <div className="max-w-sm mx-auto mt-6 sm:flex sm:max-w-none sm:justify-center">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center justify-center px-4 py-3 text-base font-medium bg-white border border-transparent rounded-md shadow-sm text-slate-700 hover:bg-slate-300 sm:px-8"
            >
              View Dashboard for {user.email}
            </Link>
          ) : (
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Link
                to="/join"
                className="flex items-center justify-center px-4 py-3 text-base font-medium bg-white border border-transparent rounded shadow-sm text-slate-900 hover:bg-slate-900 hover:text-white sm:px-8"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center px-4 py-3 font-medium text-white rounded bg-slate-700 hover:bg-slate-400 hover:text-slate-900"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </WavyBackground>
    </main>
  );
}
