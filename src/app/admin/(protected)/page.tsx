import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logout } from "./actions";

const HOME_SECTION_ORDER = ["hero", "about", "products", "team", "cta"];
const PROFILE_SECTION_ORDER = ["profileSummary", "visi", "misi", "corporateCulture", "halal", "bpom"];

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  about: "About / Who We Are",
  products: "Products (intro text)",
  team: "Our Team (intro text)",
  cta: "Call To Action / Contact",
  profileSummary: "Company Profile Summary",
  visi: "Visi",
  misi: "Misi",
  corporateCulture: "Corporate Culture",
  halal: "Halal Certificate",
  bpom: "BPOM Certificate",
};

function bySectionOrder(order: string[]) {
  return (a: { key: string }, b: { key: string }) =>
    order.indexOf(a.key) - order.indexOf(b.key);
}

function SectionList({
  title,
  sections,
}: {
  title: string;
  sections: { key: string; titleEn: string }[];
}) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-teal-600">
        {title}
      </h2>
      <ul className="mt-3 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        {sections.map((section) => (
          <li
            key={section.key}
            className="flex items-center justify-between px-6 py-4"
          >
            <div>
              <p className="font-medium text-brand-teal-900">
                {SECTION_LABELS[section.key] ?? section.key}
              </p>
              <p className="text-sm text-zinc-500">{section.titleEn}</p>
            </div>
            <Link
              href={`/admin/sections/${section.key}`}
              className="text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-800"
            >
              Edit →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const session = await auth();
  const allSections = await prisma.pageSection.findMany();

  const homeSections = allSections
    .filter((s) => HOME_SECTION_ORDER.includes(s.key))
    .sort(bySectionOrder(HOME_SECTION_ORDER));
  const profileSections = allSections
    .filter((s) => PROFILE_SECTION_ORDER.includes(s.key))
    .sort(bySectionOrder(PROFILE_SECTION_ORDER));

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-teal-900">
            Site Content
          </h1>
          <p className="text-sm text-zinc-500">
            Signed in as {session?.user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="rounded-full border border-brand-teal-200 px-4 py-2 text-sm font-medium text-brand-teal-700 transition-colors hover:bg-brand-teal-50"
          >
            View website
          </Link>
          <form action={logout}>
            <button className="rounded-full border border-brand-teal-200 px-4 py-2 text-sm font-medium text-brand-teal-700 transition-colors hover:bg-brand-teal-50">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {saved && (
        <p className="mt-4 rounded-lg bg-brand-lime-100 px-4 py-3 text-sm text-brand-teal-900">
          {SECTION_LABELS[saved] ?? saved} saved successfully.
        </p>
      )}

      <SectionList title="Homepage" sections={homeSections} />

      <div className="mt-3 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="font-medium text-brand-teal-900">Product items</p>
            <p className="text-sm text-zinc-500">
              Add, edit, or remove product cards
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-800"
          >
            Manage →
          </Link>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="font-medium text-brand-teal-900">Team members</p>
            <p className="text-sm text-zinc-500">
              Add, edit, or remove team member cards
            </p>
          </div>
          <Link
            href="/admin/team"
            className="text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-800"
          >
            Manage →
          </Link>
        </div>
      </div>

      <SectionList title="Profile page" sections={profileSections} />

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-teal-600">
          News page
        </h2>
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium text-brand-teal-900">News articles</p>
              <p className="text-sm text-zinc-500">
                Add, edit, or remove articles
              </p>
            </div>
            <Link
              href="/admin/blog"
              className="text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-800"
            >
              Manage →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
