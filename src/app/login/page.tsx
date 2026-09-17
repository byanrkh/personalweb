import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { login } from "./action";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container className="w-full max-w-sm space-y-8">
        <PageHeading title="Login" />

        <form action={login} className="space-y-4">
          <input
            type="hidden"
            name="redirectTo"
            value={params.redirectTo ?? "/"}
          />

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-zinc-500">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-zinc-500">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:border-zinc-600"
            />
          </div>

          {params.error ? (
            <p className="text-sm text-red-400">{params.error}</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-300"
          >
            Sign in
          </button>
        </form>
      </Container>
    </div>
  );
}
