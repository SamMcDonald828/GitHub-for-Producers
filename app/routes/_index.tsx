import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { WavyBackground } from "~/components/components/ui/wavy-background";

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="">
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl mt-28">
          <span className="uppercase text-white drop-shadow-md">
            Producers Space
          </span>
        </h1>
        <p className="text-2xl mt-6 md:text-4xl text-white font-normal inter-var text-center">
          The GitHub for Music Producers
        </p>
        <div className="mx-auto mt-6 max-w-sm sm:flex sm:max-w-none sm:justify-center">
          {user ? (
            <Link
              to="/notes"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-300 sm:px-8"
            >
              View Notes for {user.email}
            </Link>
          ) : (
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Link
                to="/join"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white sm:px-8"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-md bg-slate-700 px-4 py-3 font-medium text-white hover:bg-slate-400 hover:text-slate-900"
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
