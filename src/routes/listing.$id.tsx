import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Phone, MapPin, ArrowLeft, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { mockListings } from "@/lib/mockData";

export const Route = createFileRoute("/listing/$id")({
  component: ListingDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center">Listing not found.</div>
  ),
});

function ListingDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const listing = mockListings.find((l) => l.id === id);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  if (!listing) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-10 text-center">
          <p className="text-muted-foreground">Listing not found.</p>
          <Button className="mt-4" onClick={() => navigate({ to: "/" })}>
            Back to home
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
              {listing.image_url && (
                <img
                  src={listing.image_url}
                  alt={listing.business_name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">{listing.business_name}</h1>
                <Badge>{listing.category}</Badge>
              </div>
              <p className="mt-4 text-muted-foreground">{listing.description}</p>
            </div>

            {/* Map placeholder */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Location</h2>
              <div className="flex aspect-[16/7] items-center justify-center rounded-lg border border-dashed bg-muted/50 text-sm text-muted-foreground">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-6 w-6" />
                  {listing.location ?? "Location on campus"}
                  <div className="text-xs">(Map integration placeholder)</div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-10">
              <h2 className="mb-3 text-lg font-semibold">Leave a review</h2>
              <Card>
                <CardContent className="space-y-3 p-5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n)}
                        type="button"
                      >
                        <Star
                          className={`h-6 w-6 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience…"
                    rows={4}
                  />
                  <Button
                    onClick={() => {
                      toast.success("Review submitted (demo)");
                      setReview("");
                    }}
                    disabled={!review.trim()}
                  >
                    Submit review
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-4">
            <Card>
              <CardContent className="space-y-3 p-5">
                <h3 className="font-semibold">Contact</h3>
                {listing.contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {listing.contact}
                  </div>
                )}
                {listing.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {listing.location}
                  </div>
                )}
                <Button className="w-full">Call now</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 text-sm">
                <h3 className="mb-1 font-semibold">Owner</h3>
                <p className="text-muted-foreground">
                  {listing.owner_name ?? "—"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Listed on {new Date(listing.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}