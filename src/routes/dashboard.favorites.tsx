import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockListings, mockFavorites } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/favorites")({
  component: Favorites,
});

function Favorites() {
  const [ids, setIds] = useState<string[]>(mockFavorites.map((f) => f.listing_id));
  const saved = mockListings.filter((l) => ids.includes(l.id));

  function remove(id: string) {
    setIds((p) => p.filter((x) => x !== id));
    toast.success("Removed from saved");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Saved Businesses</h2>
        <p className="text-sm text-muted-foreground">
          Quick access to businesses you've bookmarked.
        </p>
      </div>

      {saved.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No saved businesses yet. Tap the heart icon on a listing to save it.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {saved.map((l) => (
            <Card key={l.id} className="overflow-hidden p-0">
              {l.image_url && (
                <img
                  src={l.image_url}
                  alt={l.business_name}
                  className="aspect-video w-full object-cover"
                />
              )}
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{l.business_name}</h3>
                  <Badge variant="outline">{l.category}</Badge>
                </div>
                {l.location && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {l.location}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/listing/$id" params={{ id: l.id }}>
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(l.id)}
                  >
                    <Heart className="mr-1 h-3.5 w-3.5 fill-current text-rose-500" />
                    Saved
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}