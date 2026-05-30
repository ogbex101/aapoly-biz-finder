import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Store,
  TrendingUp,
  Star,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { defaultCategories, type Category, type Listing } from "@/lib/mockData";
import heroCampus from "@/assets/hero-campus.jpg";
import sectionEntrepreneur from "@/assets/section-entrepreneur.jpg";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "CampusBiz — AAPoly Business Directory" },
      {
        name: "description",
        content:
          "Find local businesses, food, fashion, salons, and services around Abraham Adesanya Polytechnic.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    // Fetch approved listings
    supabase
      .from("listings")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setListings(data as Listing[]);
        setLoadingListings(false);
      });

    // Fetch categories
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setCategories(data as Category[]);
      });
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchQ =
        !q ||
        l.business_name.toLowerCase().includes(q.toLowerCase()) ||
        l.description.toLowerCase().includes(q.toLowerCase());
      const matchCat = !activeCat || l.category === activeCat;
      return matchQ && matchCat;
    });
  }, [listings, q, activeCat]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-4">
              Abraham Adesanya Polytechnic · Online Campus Directory
            </Badge>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Discover Local Businesses Around{" "}
              <span className="text-primary">AAPoly</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
              Food spots, salons, printing, fashion, repairs and student-run
              services — all verified and listed in one place.
            </p>

            <div className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search e.g. 'Jollof', 'Printing'…"
                  className="h-12 pl-10"
                />
              </div>
              <Button size="lg" className="h-12">
                Search
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate({ to: "/signup" })}>
                List your business <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("listings")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse listings
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Verified vendors
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Student reviewed
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                On-campus only
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-2xl" />
            <img
              src={heroCampus}
              alt="Students browsing campus businesses at Abraham Adesanya Polytechnic"
              width={1600}
              height={1024}
              className="aspect-[4/3] w-full rounded-2xl border object-cover shadow-2xl"
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border bg-background p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none">
                    {listings.length}+
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active businesses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="container mx-auto px-4 pb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat(null)}
              className={`rounded-full border px-4 py-1.5 text-sm ${!activeCat ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.name)}
                className={`rounded-full border px-4 py-1.5 text-sm ${activeCat === c.name ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why CampusBiz */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Built for the AAPoly community
            </h2>
            <p className="mt-3 text-muted-foreground">
              Connecting students with trusted on-campus services — and giving
              student entrepreneurs the visibility they deserve.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Curated & verified",
                desc: "Every listing is reviewed by campus admins before going live.",
              },
              {
                icon: Users,
                title: "Student-first",
                desc: "Discover services nearby — from jollof rice to laptop repairs.",
              },
              {
                icon: TrendingUp,
                title: "Grow your hustle",
                desc: "Tools, analytics and reach for student-run businesses.",
              },
            ].map((f) => (
              <Card key={f.title} className="border bg-background">
                <CardContent className="p-6">
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section id="listings" className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Featured Businesses
            </h2>
            <p className="text-sm text-muted-foreground">
              {loadingListings ? "Loading…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {loadingListings ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
            No businesses match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <Card
                key={l.id}
                className="group overflow-hidden p-0 transition-shadow hover:shadow-lg"
              >
                <Link
                  to="/listing/$id"
                  params={{ id: l.id }}
                  className="block"
                >
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {l.image_url && (
                      <img
                        src={l.image_url}
                        alt={l.business_name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{l.business_name}</h3>
                      <Badge variant="outline">{l.category}</Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {l.description}
                    </p>
                    {l.location && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {l.location}
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <Button size="sm" variant="secondary">
                        Contact
                      </Button>
                      <span className="text-xs text-primary group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Entrepreneur CTA */}
      <section className="border-t bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto grid items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-bl from-primary/15 to-transparent blur-2xl" />
            <img
              src={sectionEntrepreneur}
              alt="Student entrepreneur managing their CampusBiz listing"
              loading="lazy"
              width={1400}
              height={1000}
              className="aspect-[4/3] w-full rounded-2xl border object-cover shadow-xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <Badge variant="secondary" className="mb-3">
              For student entrepreneurs
            </Badge>
            <h2 className="text-3xl font-bold md:text-4xl">
              Turn your campus hustle into a real brand
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Create a listing in minutes, manage orders, track views and reach
              every student at AAPoly — all from one dashboard.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Free business listing with photo & contact",
                "Built-in analytics & visitor insights",
                "Direct messages from interested students",
                "Verified badge after admin approval",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate({ to: "/signup" })}>
                Get started free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/login" })}
              >
                I already have an account
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CampusBiz · Abraham Adesanya Polytechnic
        </div>
      </footer>
    </div>
  );
}
