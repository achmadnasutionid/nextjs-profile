import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LogoMark } from "@/components/logo";

async function login(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/admin/login?error=1");
    }
    throw err;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-teal-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-brand-teal-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight text-brand-teal-900">
            Bona Nauli Perkasa
          </span>
        </div>
        <h1 className="mt-6 text-xl font-semibold text-brand-teal-900">
          Admin sign in
        </h1>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid email or password.
          </p>
        )}
        <form action={login} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-zinc-700">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Password
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-brand-teal-500 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-brand-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
