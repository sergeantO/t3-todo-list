import Link from "next/link";

import { auth } from "~/server/auth";
import { serverapi, HydrateClient } from "~/trpc/server";
import { TodoList } from "./_components/TodoList";
import CreateTodo from "./_components/CreateTodo";

export default async function Home() {
  const hello = await serverapi.todo.hello({ text: "from tRPC" });
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div>
            {session?.user && (
              <div className="rounded-md border border-violet-900 px-3 py-3">
                <h1>TODOS</h1>
                <CreateTodo />
                <div className="my-8"></div>
                <TodoList />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {session?.user && `hello ${session?.user?.name}`}
        </div>
      </main>
    </HydrateClient>
  );
}
